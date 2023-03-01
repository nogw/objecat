import { Expression } from './base';
import { Expr } from './Expr';

import { Token } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';

export class ExprGet extends Expr {
  constructor(readonly object: Expression, readonly name: Token, readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}
