const endWhileLine = require('./ENDWHILE');

describe('ENDWHILE line', () => {
  test('should return a statement AST containing the keyword', () => {
    const ast = endWhileLine.run('ENDWHILE');

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('ENDWHILE');
  });
});
