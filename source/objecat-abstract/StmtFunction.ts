import { Statement } from './base';
import { Stmt } from './Stmt';
import { Type } from './Type';

import { Token } from '../objecat-grammar/token';
import { Range } from '../objecat-spanned';

export class StmtFunction extends Stmt {
  constructor(
    readonly name: Token,
    readonly params: Array<Annotation>,
    readonly body: Statement[],
    readonly range: Range,
    readonly retty: Type
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

export class Annotation {
  param: Token;
  annot: Type;
  range: Range;

  constructor(param: Token, annot: Type, range: Range) {
    this.param = param;
    this.annot = annot;
    this.range = range;
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}
