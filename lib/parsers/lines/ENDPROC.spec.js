const endProcLine = require('./ENDPROC');

describe('ENDPROC line', () => {
  test('should return a statement AST containing the keyword', () => {
    const ast = endProcLine.run('ENDPROC');

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('ENDPROC');
  });
});
