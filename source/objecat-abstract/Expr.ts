import { Range } from '../objecat-spanned';

export abstract class Expr {
  abstract location(): Range;
  abstract toString(): string;
}
