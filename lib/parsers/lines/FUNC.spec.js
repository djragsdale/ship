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

  test('should allow parameters if used', () => {
    const funcName = 'FuncName8';
    const param0 = '$p0';
    const param1 = '$p1';
    const ast = funcLine.run(`FUNC ${funcName} ${param0} ${param1}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('FUNC');
    expect(ast.result.name).toBe(funcName);
    expect(ast.result.parameters[0].type).toBe('variable');
    expect(ast.result.parameters[0].value).toBe(param0);
    expect(ast.result.parameters[1].type).toBe('variable');
    expect(ast.result.parameters[1].value).toBe(param1);
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
