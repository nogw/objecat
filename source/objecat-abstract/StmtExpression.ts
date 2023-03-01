import { Range } from '../objecat-spanned';
import { Expression } from './base';
import { Stmt } from './Stmt';

export class StmtExpression extends Stmt {
  constructor(readonly expression: Expression, readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}
