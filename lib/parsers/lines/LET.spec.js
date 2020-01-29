const letLine = require('./LET');

const types = require('../../constants/types');

describe('LET line', () => {
  test('should return a statement AST containing the keyword', () => {
    const varName = '$myVariable';
    const newValue = 'something';
    const ast = letLine.run(`LET ${varName} = "${newValue}"`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('LET');
  });

  test('should allow assigning a primitive bool', () => {
    const varName = '$myVariable';
    const newValue = 'True';
    const ast = letLine.run(`LET ${varName} = ${newValue}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe('=');
    expect(ast.result.expression.type).toBe(types.Boolean);
    expect(ast.result.expression.value).toBe(newValue);
  });

  test('should allow assigning a boolean expression', () => {

  });

  test('should allow assigning a primitive character', () => {
    const varName = '$myVariable';
    const newValue = 'C';
    const ast = letLine.run(`LET ${varName} = '${newValue}'`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe('=');
    expect(ast.result.expression.type).toBe(types.Character);
    expect(ast.result.expression.value).toBe(newValue);
  });

  test('should allow assigning a character expression', () => {

  });

  test('should allow assigning a primitive float', () => {
    const varName = '$myVariable';
    const ast = letLine.run(`LET ${varName} = 8.3`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe('=');
    expect(ast.result.expression.type).toBe(types.Float);
    expect(ast.result.expression.value).toStrictEqual(['8', '.', ['3']]);
  });

  test('should allow assigning a float expression', () => {

  });

  test('should allow assigning a primitive string', () => {
    const varName = '$myVariable';
    const newValue = 'something';
    const ast = letLine.run(`LET ${varName} = "${newValue}"`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe('=');
    expect(ast.result.expression.type).toBe(types.String);
    expect(ast.result.expression.value).toBe(newValue);
  });

  test('should allow assigning a string expression', () => {

  });

  test('should return an error if invalid variable name is used', () => {
    const varName = 'myVariable';
    const ast = letLine.run(`LET ${varName} = "something"`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(4);
  });

  test('should return an error if variable name is missing', () => {
    const ast = letLine.run('LET = "something"');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(4);
  });

  test('should return an error if assignment value is missing', () => {
    const ast = letLine.run('LET $MyVariable = ');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(18);
  });
});
