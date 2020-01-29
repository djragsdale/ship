const remLine = require('./REM');

describe('REM line', () => {
  test('should return a statement AST containing the keyword and comment', () => {
    const comment = '$myVariable whatever I what to say without syntax check';
    const ast = remLine.run(`REM ${comment}\n`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('REM');
    expect(ast.result.statement.type).toBe('comment');
    expect(ast.result.statement.value).toBe(comment);
  });
});
