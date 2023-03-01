import { Expr } from './Expr';

import { Token } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';

export class ExprVariable extends Expr {
  constructor(readonly ident: Token, readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}
