const returnLine = require('./RETURN');

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
