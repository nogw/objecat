import { Expr } from './Expr';

import { VToken } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';

export class ExprInteger extends Expr {
  constructor(readonly value: VToken, readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}
