import { Range } from '../objecat-spanned';
import { Expression } from './base';
import { Expr } from './Expr';

export class ExprGrouping extends Expr {
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
