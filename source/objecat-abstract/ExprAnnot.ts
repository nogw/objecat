import { Expr } from './Expr';
import { Type } from './Type';

import { Token } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';

export class ExprAssign extends Expr {
  constructor(readonly expr: Token, readonly type: Type, readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}
