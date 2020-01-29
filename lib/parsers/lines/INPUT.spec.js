const inputLine = require('./INPUT');

describe('INPUT line', () => {
  test('should return a statement AST containing the variable name', () => {
    const varName = '$myVariable';
    const prompt = 'What is your name?';
    const ast = inputLine.run(`INPUT ${varName} "${prompt}"`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('INPUT');
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.prompt.type).toBe('string');
    expect(ast.result.prompt.value).toBe(prompt);
  });

  test('should allow a variable prompt', () => {
    const varName = '$myVariable';
    const prompt = '$myPrompt';
    const ast = inputLine.run(`INPUT ${varName} ${prompt}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('INPUT');
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.value).toBe(varName);
    expect(ast.result.prompt.type).toBe('variable');
    expect(ast.result.prompt.value).toBe(prompt);
  });

  test('should return an error if invalid variable name is used', () => {
    const varName = 'myVariable';
    const ast = inputLine.run(`INPUT "${varName}" "What is your name?"`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(6);
  });

  test('should return an error if variable name is missing', () => {
    const ast = inputLine.run('INPUT "What is your name?"');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(6);
  });

  test('should return an error if prompt message is missing', () => {
    const ast = inputLine.run('INPUT $myVariable');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(17);
  });
});
