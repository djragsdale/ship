const funcLine = require('./FUNC');

describe('FUNC line', () => {
  test('should return a statement AST containing the Func name', () => {
    const funcName = 'FuncName8';
    const ast = funcLine.run(`FUNC ${funcName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('FUNC');
    expect(ast.result.name).toBe(funcName);
    expect(ast.result.parameters).toStrictEqual([]);
  });

  test('should parameters if used', () => {
    const funcName = 'FuncName8';
    const ast = funcLine.run(`FUNC ${funcName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('FUNC');
    expect(ast.result.name).toBe(funcName);
    expect(ast.result.parameters).toStrictEqual([]);
  });

  test('should return an error if invalid func name is used', () => {
    const funcName = '$';
    const ast = funcLine.run(`FUNC ${funcName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(5);
  });

  test('should return an error if func name is missing', () => {
    const ast = funcLine.run('FUNC');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(4);
  });
});
