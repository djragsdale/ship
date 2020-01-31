const structBlock = require('./STRUCT');

describe('STRUCT block', () => {
  test('should return a statement AST containing the struct', () => {
    const block = `
REM For cars and stuff
STRUCT Car (
  year
  make
  model
)
    `;
    const ast = structBlock.run(block);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('STRUCT');
    expect(ast.result.props).toBeInstanceOf(Object);
    expect(ast.result.props.year.type).toBe('prop');
    expect(ast.result.props.year.value).toBe('year');
    expect(ast.result.props.make.type).toBe('prop');
    expect(ast.result.props.make.value).toBe('make');
    expect(ast.result.props.model.type).toBe('prop');
    expect(ast.result.props.model.value).toBe('model');
  });

  test('should return an error if invalid struct name is passed', () => {
    const block = `
    `;
    const ast = structBlock.run(block);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(6);
  });

  test('should return an error if struct contents are missing', () => {
    const block = `
    `;
    const ast = structBlock.run(block);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(5);
  });
});
