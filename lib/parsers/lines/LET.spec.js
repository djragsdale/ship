const letLine = require('./LET');

const operators = require('../../constants/operators');
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
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe(types.Boolean);
    expect(ast.result.expression.value).toBe(newValue);
  });

  test('should allow assigning a boolean expression', () => {
    const varName = '$myVariable';
    const newValue1 = '4';
    const newValue2 = '5';
    const ast = letLine.run(`LET ${varName} = (${newValue1} < ${newValue2})`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe('expression');
    expect(ast.result.expression.left.type).toBe(types.Float);
    expect(ast.result.expression.left.value).toStrictEqual([newValue1, null, null]);
    expect(ast.result.expression.operator.type).toBe('operator');
    expect(ast.result.expression.operator.value).toBe(operators.LESS_THAN);
    expect(ast.result.expression.right.type).toBe(types.Float);
    expect(ast.result.expression.right.value).toStrictEqual([newValue2, null, null]);
  });

  test('should allow assigning a primitive character', () => {
    const varName = '$myVariable';
    const newValue = 'C';
    const ast = letLine.run(`LET ${varName} = '${newValue}'`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe(types.Character);
    expect(ast.result.expression.value).toBe(newValue);
  });

  test('should allow assigning a primitive float', () => {
    const varName = '$myVariable';
    const ast = letLine.run(`LET ${varName} = 8.3`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe(types.Float);
    expect(ast.result.expression.value).toStrictEqual(['8', '.', ['3']]);
  });

  test('should allow assigning a primitive string', () => {
    const varName = '$myVariable';
    const newValue = 'something';
    const ast = letLine.run(`LET ${varName} = "${newValue}"`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe(types.String);
    expect(ast.result.expression.value).toBe(newValue);
  });

  test('should allow assigning an array of primitives', () => {
    const varName = '$myVariable';
    const newValue1 = 'something';
    const newValue2 = 'else';
    const ast = letLine.run(`LET ${varName} = ["${newValue1}", "${newValue2}"]`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe('array');
    expect(ast.result.expression.value[0].type).toBe(types.String);
    expect(ast.result.expression.value[0].value).toBe(newValue1);
    expect(ast.result.expression.value[1].type).toBe(types.String);
    expect(ast.result.expression.value[1].value).toBe(newValue2);
  });

  test('should allow assigning a string concatenation expression', () => {
    const varName = '$myVariable';
    const newValue1 = 'something';
    const newValue2 = ' else';
    const ast = letLine.run(`LET ${varName} = ("${newValue1}" & "${newValue2}")`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe('expression');
    expect(ast.result.expression.left.type).toBe(types.String);
    expect(ast.result.expression.left.value).toBe(newValue1);
    expect(ast.result.expression.operator.type).toBe('operator');
    expect(ast.result.expression.operator.value).toBe(operators.CONCAT);
    expect(ast.result.expression.right.type).toBe(types.String);
    expect(ast.result.expression.right.value).toBe(newValue2);
  });

  test('should allow assigning a character str method', () => {
    const varName = '$myVariable';
    const newValue = 's';
    const ast = letLine.run(`LET ${varName} = '${newValue}'->str`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe('method');
    expect(ast.result.expression.method).toBe('str');
    expect(ast.result.expression.arguments).toStrictEqual([]);
    expect(ast.result.expression.parent.type).toBe('char');
    expect(ast.result.expression.parent.value).toBe(newValue);
    expect(ast.result.expression.operator.type).toBe('operator');
    expect(ast.result.expression.operator.value).toBe(operators.ACCESS);
  });

  test('should allow assigning a string char method', () => {
    const varName = '$myVariable';
    const newValue = 'something';
    const ast = letLine.run(`LET ${varName} = "${newValue}"->char [3]`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe('method');
    expect(ast.result.expression.method).toBe('char');
    expect(ast.result.expression.arguments[0].type).toBe(types.Float);
    expect(ast.result.expression.arguments[0].value).toStrictEqual(['3', null, null]);
    expect(ast.result.expression.parent.type).toBe(types.String);
    expect(ast.result.expression.parent.value).toBe(newValue);
    expect(ast.result.expression.operator.type).toBe('operator');
    expect(ast.result.expression.operator.value).toBe(operators.ACCESS);
  });

  test('should allow assigning a string slice method', () => {
    const varName = '$myVariable';
    const newValue = 'something';
    const ast = letLine.run(`LET ${varName} = "${newValue}"->slice [3, 8]`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe('method');
    expect(ast.result.expression.method).toBe('slice');
    expect(ast.result.expression.arguments[0].type).toBe(types.Float);
    expect(ast.result.expression.arguments[0].value).toStrictEqual(['3', null, null]);
    expect(ast.result.expression.arguments[1].type).toBe(types.Float);
    expect(ast.result.expression.arguments[1].value).toStrictEqual(['8', null, null]);
    expect(ast.result.expression.parent.type).toBe(types.String);
    expect(ast.result.expression.parent.value).toBe(newValue);
    expect(ast.result.expression.operator.type).toBe('operator');
    expect(ast.result.expression.operator.value).toBe(operators.ACCESS);
  });

  test('should allow assigning a string len method', () => {
    const varName = '$myVariable';
    const newValue = 'something';
    const ast = letLine.run(`LET ${varName} = "${newValue}"->len`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe('method');
    expect(ast.result.expression.method).toBe('len');
    expect(ast.result.expression.arguments).toStrictEqual([]);
    expect(ast.result.expression.parent.type).toBe(types.String);
    expect(ast.result.expression.parent.value).toBe(newValue);
    expect(ast.result.expression.operator.type).toBe('operator');
    expect(ast.result.expression.operator.value).toBe(operators.ACCESS);
  });

  test('should allow assigning an array slice method', () => {
    const varName = '$myVariable';
    const value1 = 'one';
    const value2 = 'more';
    const value3 = 'thing';
    const ast = letLine.run(`LET ${varName} = ["${value1}", "${value2}", "${value3}"]->slice [1]`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe('method');
    expect(ast.result.expression.method).toBe('slice');
    expect(ast.result.expression.arguments[0].type).toBe(types.Float);
    expect(ast.result.expression.arguments[0].value).toStrictEqual(['1', null, null]);
    expect(ast.result.expression.parent.type).toBe('array');
    expect(ast.result.expression.parent.value[0].type).toBe(types.String);
    expect(ast.result.expression.parent.value[0].value).toBe(value1);
    expect(ast.result.expression.parent.value[1].type).toBe(types.String);
    expect(ast.result.expression.parent.value[1].value).toBe(value2);
    expect(ast.result.expression.parent.value[2].type).toBe(types.String);
    expect(ast.result.expression.parent.value[2].value).toBe(value3);
    expect(ast.result.expression.operator.type).toBe('operator');
    expect(ast.result.expression.operator.value).toBe(operators.ACCESS);
  });

  test('should allow assigning an array len method', () => {
    const varName = '$myVariable';
    const value1 = 'one';
    const value2 = 'more';
    const value3 = 'thing';
    const ast = letLine.run(`LET ${varName} = ["${value1}", "${value2}", "${value3}"]->len`);

    expect(ast.isError).toBe(false);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.operator.type).toBe('operator');
    expect(ast.result.operator.value).toBe(operators.ASSIGN);
    expect(ast.result.expression.type).toBe('method');
    expect(ast.result.expression.method).toBe('len');
    expect(ast.result.expression.arguments).toStrictEqual([]);
    expect(ast.result.expression.parent.type).toBe('array');
    expect(ast.result.expression.parent.value[0].type).toBe(types.String);
    expect(ast.result.expression.parent.value[0].value).toBe(value1);
    expect(ast.result.expression.parent.value[1].type).toBe(types.String);
    expect(ast.result.expression.parent.value[1].value).toBe(value2);
    expect(ast.result.expression.parent.value[2].type).toBe(types.String);
    expect(ast.result.expression.parent.value[2].value).toBe(value3);
    expect(ast.result.expression.operator.type).toBe('operator');
    expect(ast.result.expression.operator.value).toBe(operators.ACCESS);
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
