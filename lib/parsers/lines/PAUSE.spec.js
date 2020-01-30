const varLine = require('./PAUSE');

describe('PAUSE line', () => {
  test('should return a statement AST containing the keyword', () => {
    const duration = '4.2';
    const ast = varLine.run(`PAUSE ${duration}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('PAUSE');
    expect(ast.result.arguments).toBeInstanceOf(Array);
    expect(ast.result.arguments.length).toBe(1);
    expect(ast.result.arguments[0].type).toBe('float');
    expect(ast.result.arguments[0].value).toStrictEqual(['4', '.', ['2']]);
  });

  test('should handle a variable duration', () => {
    const varName = '$myVariable';
    const ast = varLine.run(`PAUSE ${varName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('PAUSE');
    expect(ast.result.arguments).toBeInstanceOf(Array);
    expect(ast.result.arguments.length).toBe(1);
    expect(ast.result.arguments[0].type).toBe('variable');
    expect(ast.result.arguments[0].value).toStrictEqual(varName);
  });

  test('should return an error if invalid parameter is passed', () => {
    const duration = 'd';
    const ast = varLine.run(`PAUSE ${duration}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(6); // Attempts to parse for "8"->len
  });

  test('should return an error if parameter is missing', () => {
    const ast = varLine.run('PAUSE');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(5);
  });
});
