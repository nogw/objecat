import { Expression } from './base';
import { Expr } from './Expr';

import { Token } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';

export class ExprUnary extends Expr {
  constructor(readonly operator: Token, readonly expr: Expression, readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}
