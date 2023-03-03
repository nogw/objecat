import { Scanner } from './objecat-grammar/scanner';
import { Parser } from './objecat-grammar/parser';

// test parser
((source: string) => {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();
  const parser = new Parser(tokens);

  console.log(parser.parse());
})(`
class counter {
  contructor(count: Int): Void {
    self.count = count;
  }
}
`);
