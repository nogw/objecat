import { Token } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';
import { Expression } from './base';
import { Stmt } from './Stmt';

export class StmtReturn extends Stmt {
  constructor(
    readonly keyword: Token,
    readonly expression: Expression | null,
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
