const echoLine = require('./ECHO');

describe('ECHO line', () => {
  test('should return a statement AST containing the keyword', () => {
    const message = 'whatever you say';
    const ast = echoLine.run(`ECHO "${message}"`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('ECHO');
  });

  test('should return string if primitive is passed', () => {
    const message = 'whatever you say';
    const ast = echoLine.run(`ECHO "${message}"`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.arguments).toBeInstanceOf(Array);
    expect(ast.result.arguments.length).toBe(1);
    expect(ast.result.arguments[0].type).toBe('string');
    expect(ast.result.arguments[0].value).toBe(message);
  });

  test('should return expression if concatenation operation is passed', () => {
    const part1 = 'my first';
    const part2 = ' plus my second';
    const ast = echoLine.run(`ECHO ("${part1}" & "${part2}")`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.arguments).toBeInstanceOf(Array);
    expect(ast.result.arguments.length).toBe(1);
    expect(ast.result.arguments[0].type).toBe('expression');
    expect(ast.result.arguments[0].left.type).toBe('string');
    expect(ast.result.arguments[0].left.value).toBe(part1);
    expect(ast.result.arguments[0].right.type).toBe('string');
    expect(ast.result.arguments[0].right.value).toBe(part2);
  });

  test('should return variable if variable is passed', () => {
    const varName = '$myString';
    const ast = echoLine.run(`ECHO ${varName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.arguments).toBeInstanceOf(Array);
    expect(ast.result.arguments.length).toBe(1);
    expect(ast.result.arguments[0].type).toBe('variable');
    expect(ast.result.arguments[0].value).toBe(varName);
  });

  test('should return an error if invalid parameter', () => {
    const varName = '4.3';
    const ast = echoLine.run(`ECHO ${varName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(5);
  });

  test('should return an error if parameter is missing', () => {
    const ast = echoLine.run('ECHO');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(4);
  });
});
