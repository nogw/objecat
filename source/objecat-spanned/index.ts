export class Position {
  index: number;

  constructor(index: number) {
    this.index = index;
  }
}

export class Range {
  start: Position;
  end: Position;

  constructor(start: number, end: number) {
    this.start = new Position(start);
    this.end = new Position(end);
  }

  mix(next: Range): Range {
    return new Range(this.start.index, next.end.index);
  }
}
