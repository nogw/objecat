import { Range } from '../objecat-spanned';
import { Expression, Statement } from './base';
import { Stmt } from './Stmt';

export class StmtIf extends Stmt {
  constructor(
    readonly condition: Expression,
    readonly thenBranch: Statement,
    readonly elseBranch: Statement | null,
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
