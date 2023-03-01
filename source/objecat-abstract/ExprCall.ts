import { Expression } from './base';
import { Expr } from './Expr';

import { Token } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';

export class ExprCall extends Expr {
  constructor(
    readonly callee: Expression,
    readonly paren: Token,
    readonly args: Expression[],
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
