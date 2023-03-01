import { Token } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';
import { Statement } from './base';
import { Stmt } from './Stmt';

export class StmtFunction extends Stmt {
  constructor(
    readonly name: Token,
    readonly params: Array<Token>,
    readonly body: Statement[],
    readonly range: Range
  ) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}
