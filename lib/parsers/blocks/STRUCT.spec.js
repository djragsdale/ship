const structBlock = require('./STRUCT');

describe('STRUCT block', () => {
  test('should return a statement AST containing the struct', () => {
    const block = `
STRUCT Car (
  FLOAT year
  STRING make
  STRING model
)
`;
    const ast = structBlock.run(block);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('STRUCT');
    expect(ast.result.name.type).toBe('struct');
    expect(ast.result.name.value).toBe('Car');
    expect(ast.result.props).toBeInstanceOf(Object);
    expect(ast.result.props[0].type).toBe('prop');
    expect(ast.result.props[0].dataType).toBe('FLOAT');
    expect(ast.result.props[0].value).toBe('year');
    expect(ast.result.props[1].type).toBe('prop');
    expect(ast.result.props[1].dataType).toBe('STRING');
    expect(ast.result.props[1].value).toBe('make');
    expect(ast.result.props[2].type).toBe('prop');
    expect(ast.result.props[2].dataType).toBe('STRING');
    expect(ast.result.props[2].value).toBe('model');
  });

  test('should return an error if invalid struct name is passed', () => {
    const block = `
STRUCT Car (
  FLOAT &#*
  STRING make
  STRING model
)
`;
    const ast = structBlock.run(block);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(14);
  });

  test('should return an error if struct contents are missing', () => {
    const block = `
STRUCT Car (
)
`;
    const ast = structBlock.run(block);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(14);
  });
});
