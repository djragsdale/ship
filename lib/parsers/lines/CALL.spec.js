const callLine = require('./CALL');

describe('CALL line', () => {
  test('should return a statement AST containing the proc name', () => {
    const procName = 'ProcName8';
    const ast = callLine.run(`CALL ${procName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('CALL');
    expect(ast.result.name).toBe(procName);
    expect(ast.result.arguments).toStrictEqual([]);
  });

  test('should return an error if invalid proc name is used', () => {
    const procName = '&';
    const ast = callLine.run(`CALL ${procName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(5);
  });

  test('should return an error if proc name is missing', () => {
    const ast = callLine.run('CALL');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(4);
  });
});
