const ifLine = require('./IF');

const types = require('../../constants/types');

describe('IF line', () => {
  test('should return a statement AST containing the expression', () => {
    const ast = ifLine.run('IF ($strLen < 2)');

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('IF');
    expect(ast.result.condition.type).toBe('expression');
    expect(ast.result.condition.left.type).toBe('variable');
    expect(ast.result.condition.left.value).toBe('$strLen');
    expect(ast.result.condition.operator.type).toBe('operator');
    expect(ast.result.condition.operator.value).toBe('<');
    expect(ast.result.condition.right.type).toBe(types.Float);
    expect(ast.result.condition.right.value).toStrictEqual(['2', null, null]);
  });

  test('should allow a variable expression', () => {
    const varName = '$myVar';
    const ast = ifLine.run(`IF ${varName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('IF');
    expect(ast.result.condition.type).toBe('variable');
    expect(ast.result.condition.value).toBe(varName);
  });

  test('should return an error if invalid expression is used', () => {
    const varName = 'myVariable';
    const ast = ifLine.run(`IF ${varName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(3);
  });

  test('should return an error if expression is missing', () => {
    const ast = ifLine.run('IF');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(2);
  });
});
