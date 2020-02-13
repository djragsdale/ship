const returnLine = require('./RETURN');

const operators = require('../../constants/operators');
const types = require('../../constants/types');

describe('RETURN line', () => {
  test('should return a statement AST containing keyword and return value', () => {
    const varName = '$myVariable';
    const ast = returnLine.run(`RETURN ${varName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('RETURN');
    expect(ast.result.expression.type).toBe('variable');
    expect(ast.result.expression.value).toBe(varName);
  });

  test('should return floats', () => {
    const ast = returnLine.run('RETURN 7');

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('RETURN');
    expect(ast.result.expression.type).toBe(types.Float);
    expect(ast.result.expression.value).toStrictEqual(['7', null, null]);
  });

  test('should return characters', () => {
    const char = 'P';
    const ast = returnLine.run(`RETURN '${char}'`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('RETURN');
    expect(ast.result.expression.type).toBe(types.Character);
    expect(ast.result.expression.value).toBe(char);
  });

  test('should return strings', () => {
    const str = 'My string!';
    const ast = returnLine.run(`RETURN "${str}"`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('RETURN');
    expect(ast.result.expression.type).toBe(types.String);
    expect(ast.result.expression.value).toBe(str);
  });

  test('should return booleans', () => {
    const ast = returnLine.run('RETURN True');

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('RETURN');
    expect(ast.result.expression.type).toBe(types.Boolean);
    expect(ast.result.expression.value).toBe('True');
  });

  test('should return expressions', () => {
    const expression = '(7 + 3)';
    const ast = returnLine.run(`RETURN ${expression}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('RETURN');
    expect(ast.result.expression.type).toBe('expression');
    expect(ast.result.expression.left.type).toBe(types.Float);
    expect(ast.result.expression.left.value).toStrictEqual(['7', null, null]);
    expect(ast.result.expression.operator.type).toBe('operator');
    expect(ast.result.expression.operator.value).toBe('+');
    expect(ast.result.expression.right.type).toBe(types.Float);
    expect(ast.result.expression.right.value).toStrictEqual(['3', null, null]);
  });

  test('should return complex struct property expressions', () => {
    const ast = returnLine.run('RETURN (((($car["year"]->str & " ") & $car["make"]) & " ") & $car["model"])');

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('RETURN');
    expect(ast.result.expression.type).toBe('expression');
    expect(ast.result.expression.left.type).toBe('expression');
    expect(ast.result.expression.left.left.type).toBe('expression');
    expect(ast.result.expression.left.left.left.type).toBe('expression');
    expect(ast.result.expression.left.left.left.left.type).toBe('method');
    expect(ast.result.expression.left.left.left.left.parent.parent.value).toBe('$car');
    expect(ast.result.expression.left.left.left.left.parent.prop.value).toBe('year');
    expect(ast.result.expression.left.left.left.left.method).toBe('str');
    expect(ast.result.expression.left.left.left.left.arguments).toStrictEqual([]);
    expect(ast.result.expression.left.left.left.operator.type).toBe('operator');
    expect(ast.result.expression.left.left.left.operator.value).toBe(operators.CONCAT);
    expect(ast.result.expression.left.left.left.right.type).toBe(types.String);
    expect(ast.result.expression.left.left.left.right.value).toBe(' ');
    expect(ast.result.expression.left.left.operator.type).toBe('operator');
    expect(ast.result.expression.left.left.operator.value).toBe(operators.CONCAT);
    expect(ast.result.expression.left.left.right.type).toBe('prop');
    expect(ast.result.expression.left.left.right.parent.value).toBe('$car');
    expect(ast.result.expression.left.left.right.prop.value).toBe('make');
    expect(ast.result.expression.left.operator.type).toBe('operator');
    expect(ast.result.expression.left.operator.value).toBe(operators.CONCAT);
    expect(ast.result.expression.left.right.type).toBe(types.String);
    expect(ast.result.expression.left.right.value).toBe(' ');
    expect(ast.result.expression.operator.type).toBe('operator');
    expect(ast.result.expression.operator.value).toBe(operators.CONCAT);
    expect(ast.result.expression.right.parent.value).toBe('$car');
    expect(ast.result.expression.right.prop.value).toBe('model');
  });

  test('should return an error if invalid primitive is used', () => {
    const varName = 'myVariable';
    const ast = returnLine.run(`RETURN ${varName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(7);
  });

  test('should return an error if return value is missing', () => {
    const ast = returnLine.run('RETURN');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(6);
  });
});
