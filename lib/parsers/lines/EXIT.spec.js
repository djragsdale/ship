const {
  sequenceOf,
  str,
} = require('arcsecond');
const exitLine = require('./EXIT');

describe('EXIT line', () => {
  test('should return a statement AST containing the keyword and program name', () => {
    const progName = 'MyProgram';
    const ast = exitLine.run(`EXIT "${progName}"`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('EXIT');
    expect(ast.result.program).toBe(progName);
  });

  test('should return program of falsy value when not included', () => {
    const ast = exitLine.run('EXIT');

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('EXIT');
    expect(ast.result.program).toBeFalsy();
  });

  test('should return an error if invalid program name is passed', () => {
    const ast = sequenceOf([exitLine, str('\n')]).run('EXIT $variableProgramName\n');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(5);
  });
});
