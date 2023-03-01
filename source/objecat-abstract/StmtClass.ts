import { Expression, Statement } from './base';
import { Stmt } from './Stmt';

import { Token } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';

export class StmtClass extends Stmt {
  constructor(
    readonly name: Token,
    readonly superclass: Expression | null,
    readonly methods: Array<Statement>,
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
