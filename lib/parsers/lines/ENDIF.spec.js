const endIfLine = require('./ENDIF');

describe('ENDIF line', () => {
  test('should return a statement AST containing the keyword', () => {
    const ast = endIfLine.run('ENDIF');

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('ENDIF');
  });
});
