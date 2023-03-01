import { Expression } from './base';
import { Expr } from './Expr';

import { Token } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';

export class ExprLogical extends Expr {
  constructor(
    readonly left: Expression,
    readonly operator: Token,
    readonly right: Expression,
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
