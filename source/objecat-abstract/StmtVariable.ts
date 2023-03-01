import { Token } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';
import { Expression } from './base';
import { Stmt } from './Stmt';

export class StmtVariable extends Stmt {
  constructor(readonly name: Token, readonly expression: Expression, readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}
