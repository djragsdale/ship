const elseLine = require('./ELSE');

describe('ELSE line', () => {
  test('should return a statement AST containing the keyword', () => {
    const ast = elseLine.run('ELSE');

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('ELSE');
  });
});
