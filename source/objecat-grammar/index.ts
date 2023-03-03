import {
  Expression,
  ExprVariable,
  ExprLogical,
  ExprBinary,
  ExprSuper,
  ExprSelf,
  ExprGrouping,
  ExprAssign,
  ExprSet,
  ExprGet,
  ExprUnary,
  ExprCall,
  ExprBoolean,
  ExprInteger,
} from '../objecat-abstract';

import {
  StmtExpression,
  StmtVariable,
  StmtFunction,
  StmtReturn,
  StmtBlock,
  StmtClass,
  StmtIf,
  Statement,
} from '../objecat-abstract';

import { Type, TypeArrow, TypeBool, TypeInt, TypeVoid } from '../objecat-abstract';
import { Annotation } from '../objecat-abstract/StmtFunction';

import { EToken, Token } from './scanner/token';
import { Range } from '../objecat-spanned';

export class Parser {
  private tokens: Array<Token>;
  private current = 0;

  constructor(tokens: Array<Token>) {
    this.tokens = tokens;
  }

  parse(): Statement[] {
    const statements = Array<Statement>();

    while (!this.isAtEnd()) {
      statements.push(this.declaration());
    }

    return statements;
  }

  expression(): Expression {
    return this.assignment();
  }

  private assignment(): Expression {
    const expr = this.or();

    if (this.match(EToken.EQUAL)) {
      const equals = this.previous();
      const value = this.assignment();

      if (expr instanceof ExprVariable) {
        const name = expr.ident;

        return new ExprAssign(name, value, name.range);
      }

      if (expr instanceof ExprGet) {
        const get = expr;

        return new ExprSet(get.object, get.name, value, get.range);
      }

      throw new Error(`${equals} is a invalid assign target.`);
    }

    return expr;
  }

  private or(): Expression {
    let expr = this.and();

    while (this.match(EToken.OR)) {
      const operator = this.previous();
      const right = this.and();

      const range = expr.location().mix(right.location());
      expr = new ExprLogical(expr, operator, right, range);
    }

    return expr;
  }

  private and(): Expression {
    let expr = this.equality();

    while (this.match(EToken.AND)) {
      const operator = this.previous();
      const right = this.equality();

      const range = expr.location().mix(right.location());
      expr = new ExprLogical(expr, operator, right, range);
    }

    return expr;
  }

  private equality(): Expression {
    let expr = this.comparison();

    while (this.match(EToken.BANG_EQUAL, EToken.BANG)) {
      const operator = this.previous();
      const right = this.comparison();

      const range = expr.location().mix(right.location());
      expr = new ExprBinary(expr, operator, right, range);
    }

    return expr;
  }

  private comparison(): Expression {
    let expr = this.term();

    while (this.match(EToken.GREATER, EToken.GREATER_EQUAL, EToken.LESS, EToken.LESS_EQUAL)) {
      const operator = this.previous();
      const right = this.term();

      const range = expr.location().mix(right.location());
      expr = new ExprBinary(expr, operator, right, range);
    }

    return expr;
  }

  private term(): Expression {
    let expr = this.factor();

    while (this.match(EToken.MINUS, EToken.PLUS)) {
      const operator = this.previous();
      const right = this.factor();

      const range = expr.location().mix(right.location());
      expr = new ExprBinary(expr, operator, right, range);
    }

    return expr;
  }

  private factor(): Expression {
    let expr = this.unary();

    while (this.match(EToken.SLASH, EToken.STAR)) {
      const operator = this.previous();
      const right = this.unary();

      const range = expr.location().mix(right.location());
      expr = new ExprBinary(expr, operator, right, range);
    }

    return expr;
  }

  private unary(): Expression {
    if (this.match(EToken.BANG, EToken.MINUS)) {
      const operator = this.previous();
      const right = this.unary();

      const range = operator.range.mix(right.location());
      return new ExprUnary(operator, right, range);
    }

    return this.call();
  }

  private finishCall(callee: Expression): Expression {
    const args = [];

    if (!this.check(EToken.RIGHT_PAREN)) {
      do {
        if (args.length >= 255) {
          throw new Error("Can't have more than 255 arguments");
        }

        args.push(this.expression());
      } while (this.match(EToken.COMMA));
    }

    const paren = this.consume(EToken.RIGHT_PAREN, "Expect ')' after arguments");

    const range = callee.location().mix(paren.range);
    return new ExprCall(callee, paren, args, range);
  }

  private call(): Expression {
    let expr = this.primary();

    for (;;) {
      if (this.match(EToken.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(EToken.DOT)) {
        const name = this.consume(EToken.IDENTIFIER, "Expect property name after '.'");
        const range = expr.location().mix(name.range);
        expr = new ExprGet(expr, name, range);
      } else {
        break;
      }
    }

    return expr;
  }

  private primary(): Expression {
    if (this.match(EToken.FALSE)) {
      const prev = this.previous();
      return new ExprBoolean({ value: false }, prev.range);
    }

    if (this.match(EToken.TRUE)) {
      const prev = this.previous();
      return new ExprBoolean({ value: true }, prev.range);
    }

    if (this.match(EToken.NUMBER, EToken.STRING)) {
      const prev = this.previous();

      return new ExprInteger(prev.expr, prev.range);
    }

    if (this.match(EToken.SUPER)) {
      const keyword = this.previous();

      this.consume(EToken.DOT, "Expect '.' after 'super'");

      const method = this.consume(EToken.IDENTIFIER, 'Expect superclass method identifier.');

      const range = keyword.range.mix(method.range);
      return new ExprSuper(keyword, method, range);
    }

    if (this.match(EToken.IDENTIFIER)) {
      const prev = this.previous();
      return new ExprVariable(prev, prev.range);
    }

    if (this.match(EToken.SELF)) {
      const prev = this.previous();
      return new ExprSelf(prev, prev.range);
    }

    if (this.match(EToken.LEFT_PAREN)) {
      const prev = this.previous();

      const expr = this.expression();

      const paren = this.consume(EToken.RIGHT_PAREN, "Expect ')' after expression.");

      const range = prev.range.mix(paren.range);
      return new ExprGrouping(expr, range);
    }

    throw new Error(`Expect expression but got ${this.peek()}`);
  }

  private declaration(): Statement {
    try {
      if (this.match(EToken.VAR)) {
        return this.stmtVariable();
      }

      return this.statement();
    } catch (error) {
      this.synchronize();
      console.log(error);
      throw new Error('todo');
    }
  }

  private statement(): Statement {
    if (this.match(EToken.IF)) return this.stmtIf();
    if (this.match(EToken.FUN)) return this.stmtFunction('function');
    if (this.match(EToken.CLASS)) return this.stmtClass();
    if (this.match(EToken.RETURN)) return this.stmtReturn();
    if (this.match(EToken.LEFT_BRACE)) {
      const prev = this.previous();
      const block = this.stmtBlock();
      const after = this.previous();

      const range = prev.range.mix(after.range);
      return new StmtBlock(block, range);
    }

    return this.expressionStatement();
  }

  private stmtVariable(): Statement {
    const prev = this.previous();

    const name = this.consume(EToken.IDENTIFIER, 'Expect variable name');
    this.consume(EToken.EQUAL, 'Expect equal after identifier');

    const expr = this.expression();
    const semi = this.consume(EToken.SEMICOLON, "Expect ';' after variable declaration");

    const range = prev.range.mix(semi.range);
    return new StmtVariable(name, expr, range);
  }

  private stmtBlock(): Statement[] {
    const statements = Array<Statement>();

    while (!this.check(EToken.RIGHT_BRACE) && !this.isAtEnd()) {
      statements.push(this.declaration());
    }

    this.consume(EToken.RIGHT_BRACE, "expect '}' after block");

    return statements;
  }

  private stmtReturn(): Statement {
    const keyword = this.previous();

    let expr = null;

    if (!this.check(EToken.SEMICOLON)) {
      expr = this.expression();
    }

    const paren = this.consume(EToken.SEMICOLON, "Expect ';' after return value.");
    const range = keyword.range.mix(paren.range);

    return new StmtReturn(keyword, expr, range);
  }

  private stmtClass(): Statement {
    const prev = this.previous();
    const name = this.consume(EToken.IDENTIFIER, 'Expect class name.');

    let superclass = null;

    if (this.match(EToken.LESS)) {
      const token = this.consume(EToken.IDENTIFIER, 'Expected superclass identifier.');
      superclass = new ExprVariable(this.previous(), token.range);
    }

    this.consume(EToken.LEFT_BRACE, "Expect '{' after class body.");

    const methods = [];

    while (!this.check(EToken.RIGHT_BRACE) && !this.isAtEnd()) {
      methods.push(this.stmtFunction('method'));
    }

    const paren = this.consume(EToken.RIGHT_BRACE, "Expect '}' before class body");
    const range = prev.range.mix(paren.range);

    return new StmtClass(name, superclass, methods, range);
  }

  private stmtFunction(kind: string): Statement {
    const prev = this.previous();
    const name = this.consume(EToken.IDENTIFIER, `Expect ${kind} identifier.`);

    this.consume(EToken.LEFT_PAREN, `Expect '(' after ${kind} identifier.`);

    const params = [];

    if (!this.check(EToken.RIGHT_PAREN)) {
      do {
        if (params.length >= 255) {
          throw new Error("Can't have more than 255 parameters.");
        }

        params.push(this.annotation());
      } while (this.match(EToken.COMMA));
    }

    this.consume(EToken.RIGHT_PAREN, `Expect ')' after parameters.`);

    this.consume(EToken.COLON, `Expect ':' after ')'.`);
    const retty = this.typeArrow();

    this.consume(EToken.LEFT_BRACE, `Expect '{' before ${kind} body.`);
    const body = this.stmtBlock();

    const after = this.previous();
    const range = prev.range.mix(after.range);

    return new StmtFunction(name, params, body, range, retty);
  }

  private annotation(): Annotation {
    const token = this.consume(EToken.IDENTIFIER, 'Expect parameter name.');

    this.consume(EToken.COLON, "Expect ':' after parameter.");

    const annot = this.typeArrow();

    return new Annotation(token, annot, token.range.mix(annot.range));
  }

  private stmtIf(): Statement {
    const prev = this.previous();

    this.consume(EToken.LEFT_PAREN, "Expect '(' after if");
    const condition = this.expression();

    this.consume(EToken.RIGHT_PAREN, "Expect ')' after if condition");
    const thenBranch = this.statement();

    if (this.match(EToken.ELSE)) {
      const elseBranch = this.statement();

      const after = this.previous();
      const range = prev.range.mix(after.range);
      return new StmtIf(condition, thenBranch, elseBranch, range);
    }

    const after = this.previous();
    const range = prev.range.mix(after.range);
    return new StmtIf(condition, thenBranch, null, range);
  }

  private expressionStatement(): Statement {
    const expr = this.expression();
    const semi = this.consume(EToken.SEMICOLON, "Expect ';' after expression.");

    const range = expr.range.mix(semi.range);
    return new StmtExpression(expr, range);
  }

  private isAtEnd(): boolean {
    return this.peek().type == EToken.EOF;
  }

  private match(...tokens: EToken[]): boolean {
    for (let i = 0; i < tokens.length; i++) {
      if (this.check(tokens[i])) {
        this.advance();
        return true;
      }
    }

    return false;
  }

  private consume(token: EToken, message: string): Token {
    if (this.check(token)) {
      return this.advance();
    }

    throw new Error(`${this.peek()} ${message}`);
  }

  private check(token: EToken): boolean {
    if (this.isAtEnd()) {
      return false;
    }

    return this.peek().type === token;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;

    return this.previous();
  }

  private peek(): Token {
    const token = this.tokens.at(this.current);

    if (!token) {
      throw new Error('undefined token');
    }

    return token;
  }

  private previous(): Token {
    const token = this.tokens.at(this.current - 1);

    if (!token) {
      throw new Error('undefined token');
    }

    return token;
  }

  private synchronize(): void {
    this.advance();

    while (this.isAtEnd()) {
      if (this.previous().type == EToken.SEMICOLON) {
        return;
      }

      switch (this.peek().type) {
        case EToken.RETURN:
        case EToken.CLASS:
        case EToken.FUN:
        case EToken.VAR:
        case EToken.FOR:
        case EToken.IF: {
          return;
        }
      }

      this.advance();
    }
  }

  private typeExpr(): Type {
    if (this.match(EToken.LEFT_PAREN)) {
      const prev = this.previous();
      const left = this.typeExpr();

      this.consume(EToken.RIGHT_PAREN, "Expect ')' after arguments");

      return this.typePartialArrow(left, prev.range);
    }

    const left = this.typeBasic();
    return this.typePartialArrow(left, left.range);
  }

  private typeBasic(): Type {
    if (this.match(EToken.TINT)) {
      const prev = this.previous();
      return new TypeInt(prev.range);
    }

    if (this.match(EToken.TBOOL)) {
      const prev = this.previous();
      return new TypeBool(prev.range);
    }

    if (this.match(EToken.TVOID)) {
      const prev = this.previous();
      return new TypeVoid(prev.range);
    }

    throw new Error('todo');
  }

  private typePartialArrow(left: Type, start: Range): Type {
    if (this.match(EToken.ARROW)) {
      const right = this.typeExpr();
      const range = start.mix(right.location());

      return new TypeArrow(left, right, range);
    }

    return left;
  }

  private typeArrow(): Type {
    const left = this.typeExpr();

    if (this.match(EToken.ARROW)) {
      const right = this.typeExpr();
      const range = left.range.mix(right.range);

      return new TypeArrow(left, right, range);
    }

    return left;
  }
}
