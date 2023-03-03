import { Range } from '../../objecat-spanned';
import { EToken, Token, VToken } from './token';

export class Scanner {
  source: string;
  tokens = new Array<Token>();
  start_pos = 0;
  current_pos = 0;
  current_line = 1;

  keywords = new Map<string, EToken>([
    ['and', EToken.AND],
    ['class', EToken.CLASS],
    ['else', EToken.ELSE],
    ['false', EToken.FALSE],
    ['for', EToken.FOR],
    ['fun', EToken.FUN],
    ['if', EToken.IF],
    ['or', EToken.OR],
    ['return', EToken.RETURN],
    ['super', EToken.SUPER],
    ['self', EToken.SELF],
    ['true', EToken.TRUE],
    ['Int', EToken.TINT],
    ['Bool', EToken.TBOOL],
    ['Void', EToken.TVOID],
    ['var', EToken.VAR],
  ]);

  constructor(source: string) {
    this.source = source;
  }

  span() {
    return this.current_pos;
  }

  range(start: number): Range {
    return new Range(start, this.current_pos);
  }

  isAtEnd() {
    return this.current_pos >= this.source.length;
  }

  advance() {
    this.current_pos++;
    return this.source.charAt(this.current_pos - 1);
  }

  addToken(token: EToken, range: Range, expr: VToken = {}) {
    const lexeme = this.source.substring(this.start_pos, this.current_pos);

    this.tokens.push(new Token(token, lexeme, range));
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start_pos = this.current_pos;
      this.scanToken();
    }

    this.tokens.push(new Token(EToken.EOF, '', this.range(this.start_pos)));

    return this.tokens;
  }

  scanToken() {
    const start = this.span();
    const char = this.advance();

    switch (char) {
      case ' ':
      case '\r':
      case '\t':
        break;

      case '\n':
        this.current_line++;
        break;

      case '(':
        this.addToken(EToken.LEFT_PAREN, this.range(start));
        break;

      case ')':
        this.addToken(EToken.RIGHT_PAREN, this.range(start));
        break;

      case '{':
        this.addToken(EToken.LEFT_BRACE, this.range(start));
        break;

      case '}':
        this.addToken(EToken.RIGHT_BRACE, this.range(start));
        break;

      case ',':
        this.addToken(EToken.COMMA, this.range(start));
        break;

      case '.':
        this.addToken(EToken.DOT, this.range(start));
        break;

      case ';':
        this.addToken(EToken.SEMICOLON, this.range(start));
        break;

      case ':':
        this.addToken(EToken.COLON, this.range(start));
        break;

      case '+':
        this.addToken(EToken.PLUS, this.range(start));
        break;

      case '*':
        this.addToken(EToken.STAR, this.range(start));
        break;

      case '-':
        this.addToken(this.match('>') ? EToken.ARROW : EToken.MINUS, this.range(start));

      case '!':
        this.addToken(this.match('=') ? EToken.BANG_EQUAL : EToken.BANG, this.range(start));
        break;

      case '=':
        this.addToken(this.match('=') ? EToken.EQUAL_EQUAL : EToken.EQUAL, this.range(start));
        break;

      case '<':
        this.addToken(this.match('=') ? EToken.LESS_EQUAL : EToken.LESS, this.range(start));
        break;

      case '>':
        this.addToken(this.match('=') ? EToken.GREATER_EQUAL : EToken.GREATER, this.range(start));
        break;

      case '/': {
        if (this.match('/')) {
          while (this.peek() !== '\n' && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(EToken.SLASH, this.range(start));
        }

        break;
      }

      case '"': {
        this.string(start);
        break;
      }

      default: {
        if (this.isDigit(char)) return this.number(start);
        if (this.isAlpha(char)) return this.identifier(start);

        const err = `Unexpected character (${char}) at line ${this.current_line} ${this.current_pos}`;
        throw new Error(err);
      }
    }
  }

  string(start: number) {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.current_line++;
      }

      if (this.isAtEnd()) {
        const err = `Unexpected unterminated string at line ${this.current_line} ${this.current_pos}`;
        throw new Error(err);
      }

      this.advance();
    }

    const value = this.source.substring(this.start_pos + 1, this.current_pos + 1);
    this.addToken(EToken.STRING, this.range(start), { value });
  }

  number(start: number) {
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance();

      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const value = parseInt(this.source.substring(this.start_pos, this.current_pos));
    this.addToken(EToken.NUMBER, this.range(start), { value });
  }

  identifier(start: number) {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const value = this.source.substring(this.start_pos, this.current_pos);
    const token = this.keywords.get(value);
    const range = this.range(start);

    if (token === undefined) {
      return this.addToken(EToken.IDENTIFIER, range);
    }

    this.addToken(token, range);
  }

  match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current_pos) !== expected) return false;

    this.current_pos++;
    return true;
  }

  peek() {
    if (this.isAtEnd()) {
      return '\0';
    }

    return this.source.charAt(this.current_pos);
  }

  peekNext() {
    if (this.current_pos + 1 >= this.source.length) {
      return '\0';
    }

    return this.source.charAt(this.current_pos + 1);
  }

  isDigit(char: string) {
    return char >= '0' && char <= '9';
  }

  isAlpha(char: string) {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char == '_';
  }

  isAlphaNumeric(char: string) {
    return this.isAlpha(char) || this.isDigit(char);
  }
}
