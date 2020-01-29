const varLine = require('./VAR');

describe('VAR line', () => {
  test('should return a statement AST containing the variable name', () => {
    const varName = '$myVariable';
    const ast = varLine.run(`VAR ${varName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('VAR');
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
  });

  test('should return an error if invalid variable name is used', () => {
    const varName = 'myVariable';
    const ast = varLine.run(`VAR ${varName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(4);
  });

  test('should return an error if variable name is missing', () => {
    const ast = varLine.run('VAR');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(3);
  });
});
