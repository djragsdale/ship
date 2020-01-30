const beginLine = require('./BEGIN');

describe('BEGIN line', () => {
  test('should return a statement AST containing the program name', () => {
    const programName = 'Whatever';
    const ast = beginLine.run(`BEGIN "${programName}"`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('BEGIN');
    expect(ast.result.program).toBe(programName);
  });

  test('should return an error if invalid program name is passed', () => {
    const ast = beginLine.run('BEGIN 8');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(7);
  });

  test('should return an error if program name is missing', () => {
    const ast = beginLine.run('BEGIN');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(5);
  });
});
