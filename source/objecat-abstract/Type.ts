import { Range } from '../objecat-spanned';

export abstract class Type {
  abstract location(): Range;
  abstract toString(): string;
}

export class TypeUnit extends Type {
  constructor(readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}

export class TypeInt extends Type {
  constructor(readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}

export class TypeBool extends Type {
  constructor(readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}

export class TypeArrow extends Type {
  constructor(readonly left: Type, readonly right: Type, readonly range: Range) {
    super();
  }

  location() {
    return this.range;
  }

  toString() {
    return `unimplemented!`;
  }
}
