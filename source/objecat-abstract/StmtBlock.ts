import { Range } from '../objecat-spanned';
import { Statement } from './base';
import { Stmt } from './Stmt';

export class StmtBlock extends Stmt {
  constructor(readonly expressions: Array<Statement>, readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}
