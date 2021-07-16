const varLine = require('./VAR');

const keywords = require('../../constants/keywords');
const typeKeywords = require('../../constants/typeKeywords');
const types = require('../../constants/types');

describe('VAR line', () => {
  test('should return a statement AST containing the variable name', () => {
    const varName = '$myVariable';
    const varType = typeKeywords[types.Boolean];
    const ast = varLine.run(`VAR ${varType} ${varName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe(keywords.VAR);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.dataType).toBe(types.Boolean);
    expect(ast.result.variable.value).toBe(varName);
  });

  test('should parse typed array', () => {
    const varName = '$myVariable';
    const varType = 'ARRAY<STRING>';
    const ast = varLine.run(`VAR ${varType} ${varName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe(keywords.VAR);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.dataType.type).toBe(types.Array);
    expect(ast.result.variable.dataType.value).toBe(types.String);
    expect(ast.result.variable.value).toBe(varName);
  });

  test('should parse struct typed array', () => {
    const varName = '$myVariable';
    const varType = 'ARRAY<Car>';
    const ast = varLine.run(`VAR ${varType} ${varName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe(keywords.VAR);
    expect(ast.result.variable.type).toBe('variable');
    expect(ast.result.variable.dataType.type).toBe(types.Array);
    expect(ast.result.variable.dataType.value).toBe('Car');
    expect(ast.result.variable.value).toBe(varName);
  });

  test('should return an error if invalid variable name is used', () => {
    const varName = 'myVariable';
    const ast = varLine.run(`VAR BOOL ${varName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(9);
  });

  test('should return an error if variable name is missing', () => {
    const ast = varLine.run('VAR BOOL');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(8);
  });

  test('should return an error if type is not valid', () => {
    const varName = 'myVariable';
    const ast = varLine.run(`VAR &notType ${varName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(4);
  });
});
