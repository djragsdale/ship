const funcLine = require('./FUNC');

describe('FUNC line', () => {
  test('should return a statement AST containing the Func name', () => {
    const funcName = 'FuncName8';
    const returnType = 'STRING';
    const ast = funcLine.run(`FUNC ${returnType}:${funcName}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('FUNC');
    expect(ast.result.name).toBe(funcName);
    expect(ast.result.returnType).toBe(returnType);
    expect(ast.result.parameters).toStrictEqual([]);
  });

  test('should allow parameters if used', () => {
    const funcName = 'FuncName8';
    const returnType = 'BOOL';
    const customParamType = 'MyStruct';
    const param0 = '$p0';
    const param1 = '$p1';
    const ast = funcLine.run(`FUNC ${returnType}:${funcName} STRING:${param0} ${customParamType}:${param1}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('FUNC');
    expect(ast.result.name).toBe(funcName);
    expect(ast.result.returnType).toBe(returnType);
    expect(ast.result.parameters[0].type).toBe('variable');
    expect(ast.result.parameters[0].dataType).toBe('STRING');
    expect(ast.result.parameters[0].value).toBe(param0);
    expect(ast.result.parameters[1].type).toBe('variable');
    expect(ast.result.parameters[1].dataType.type).toBe('struct');
    expect(ast.result.parameters[1].dataType.value).toBe(customParamType);
    expect(ast.result.parameters[1].value).toBe(param1);
  });

  test('should allow parameters of custom structs', () => {
    const returnType = 'STRING';
    const funcName = 'FormatCarString';
    const customParamType = 'Car';
    const param0 = '$car';
    const ast = funcLine.run(`FUNC ${returnType}:${funcName} ${customParamType}:${param0}`);

    expect(ast.isError).toBe(false);
    expect(ast.result.type).toBe('statement');
    expect(ast.result.keyword).toBe('FUNC');
    expect(ast.result.name).toBe(funcName);
    expect(ast.result.returnType).toBe(returnType);
    expect(ast.result.parameters[0].type).toBe('variable');
    expect(ast.result.parameters[0].dataType.type).toBe('struct');
    expect(ast.result.parameters[0].dataType.value).toBe(customParamType);
    expect(ast.result.parameters[0].value).toBe(param0);
  });

  test('should return an error if invalid func name is used', () => {
    const funcName = '$';
    const returnType = 'STRING';
    const ast = funcLine.run(`FUNC ${returnType}:${funcName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(12);
  });

  test('should return an error if return type is missing', () => {
    const funcName = 'MyFunc';
    const ast = funcLine.run(`FUNC ${funcName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(11);
  });

  test('should return an error if return type is invalid', () => {
    const funcName = 'MyFunc';
    const returnType = '$something';
    const ast = funcLine.run(`FUNC ${returnType}:${funcName}`);

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(5);
  });

  test('should return an error if func name is missing', () => {
    const ast = funcLine.run('FUNC');

    expect(ast.isError).toBe(true);
    expect(ast.index).toBe(4);
  });
});
