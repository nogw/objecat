import { Range } from '../objecat-spanned';

export abstract class Stmt {
  abstract location(): Range;
  abstract toString(): string;
}
