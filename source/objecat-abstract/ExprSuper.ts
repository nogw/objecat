import { Expr } from './Expr';

import { Token } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';

export class ExprSuper extends Expr {
  constructor(readonly keyword: Token, readonly method: Token, readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}
