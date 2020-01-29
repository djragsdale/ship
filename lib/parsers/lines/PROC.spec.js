const procLine = require('./PROC');

describe('PROC line', () => {
  test('should return a statement AST containing the proc name', () => {
    const procName = 'ProcName8';
    const ast = procLine.run(`PROC ${procName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('PROC');
    expect(ast.result.name).toBe(procName);
  });

  test('should return an error if invalid proc name is used', () => {
    const procName = '$myVariable';
    const ast = procLine.run(`PROC ${procName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(5);
  });

  test('should return an error if proc name is missing', () => {
    const ast = procLine.run('PROC');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(4);
  });
});
