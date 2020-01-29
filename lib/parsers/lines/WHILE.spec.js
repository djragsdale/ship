const varLine = require('./WHILE');

describe('WHILE line', () => {
  test('should return a statement AST containing the keyword', () => {
    const ast = varLine.run('WHILE ($i < 8)');

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('WHILE');
    expect(ast.result.condition.type).toBe('expression');
    expect(ast.result.condition.left.type).toBe('variable');
    expect(ast.result.condition.left.value).toBe('$i');
    expect(ast.result.condition.operator.type).toBe('operator');
    expect(ast.result.condition.operator.value).toBe('<');
    expect(ast.result.condition.right.type).toBe('float');
    expect(ast.result.condition.right.value).toStrictEqual(['8', null, null]);
  });

  test('should allow a variable expression', () => {
    const varName = '$myVariable';
    const ast = varLine.run(`WHILE ${varName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('WHILE');
    expect(ast.result.condition.type).toBe('variable');
    expect(ast.result.condition.value).toBe(varName);
  });

  test('should return an error if invalid variable name is used', () => {
    const varName = 'myVariable';
    const ast = varLine.run(`WHILE ${varName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(6);
  });

  test('should return an error if expression is missing', () => {
    const ast = varLine.run('WHILE');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(5);
  });
});
