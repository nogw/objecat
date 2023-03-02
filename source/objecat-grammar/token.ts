import { Range } from '../objecat-spanned';

export enum EToken {
  LEFT_PAREN,
  RIGHT_PAREN,
  LEFT_BRACE,
  RIGHT_BRACE,
  COMMA,
  DOT,
  MINUS,
  PLUS,
  SEMICOLON,
  SLASH,
  STAR,
  BANG,
  BANG_EQUAL,
  EQUAL,
  EQUAL_EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,
  IDENTIFIER,
  STRING,
  NUMBER,
  METHOD,
  SUPER,
  AND,
  CLASS,
  ELSE,
  FALSE,
  FUN,
  FOR,
  IF,
  OR,
  RETURN,
  SELF,
  TRUE,
  VAR,
  TINT,
  TBOOL,
  TUNIT,
  TARROW,
  EOF,
}

export type VToken = { value: number } | { value: boolean } | { value: string } | {};

export class Token {
  type: EToken;
  expr: VToken;
  lexeme: string;
  range: Range;

  constructor(type: EToken, lexeme: string, range: Range, expr: VToken = {}) {
    this.type = type;
    this.expr = expr;
    this.lexeme = lexeme;
    this.range = range;
  }

  toString() {
    return `unimplemented!`;
  }
}
