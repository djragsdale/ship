const endFuncLine = require('./ENDFUNC');

describe('ENDFUNC line', () => {
  test('should return a statement AST containing the keyword', () => {
    const ast = endFuncLine.run('ENDFUNC');

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('ENDFUNC');
  });
});
