const uuidv4 = require('uuid/v4');

const keywords = require('./constants/keywords');
const Parser = require('./Parser');
const types = require('./constants/types');
const typesByTypeKeywords = require('./constants/typesByTypeKeywords');

const errors = require('./interpreter/errors');

const echoFactory = require('./interpreter/io/echo');
const getInputFactory = require('./interpreter/io/getInput');
const memory = require('./interpreter/memory');
const evaluateExpressionFactory = require('./interpreter/evaluateExpression');
const lineIsStatement = require('./interpreter/lineIsStatement');
const pause = require('./interpreter/pause');
const {
  getArrayType,
  getStructType,
  isArray,
  isRawArray,
  isStruct,
  isType,
} = require('./interpreter/typeChecks');

const interpret = async (script, {
  stdin = process.stdin,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) => {
  // TODO: Implement stderr
  const programData = {};
  // Scopes create symbols which get their own memory heap
  const references = [];
  const structs = {};

  // TODO: Some sort of a malloc command generates a symbol for the variable name

  const echo = echoFactory({ stdout });
  const getInput = getInputFactory({ stdin });

  const ast = Parser.run(script);

  if (ast.isError) {
    stderr.write(`SHIP ERROR at index ${ast.index}\n`);
    stderr.write(ast.error);
    console.log('\n\n'); // eslint-disable-line no-console
    console.log(ast); // eslint-disable-line no-console
    throw new Error('SHIP error');
  }

  // console.log(JSON.stringify(ast, null, 2));

  const stackTrace = [];
  const doBlock = async (block, {
    memScope = uuidv4(),
    refs = references,
  } = {}) => { // eslint-disable-line consistent-return
    if (!block) {
      throw new Error('doBlock requires a block');
    }

    const evaluateExpression = evaluateExpressionFactory({
      doBlock,
      memScope,
      memory,
      refs,
      stackTrace,
      structs,
    });

    for (let i = 0; i < block.length; i += 1) {
      const line = block[i];
      stackTrace.push(line);

      if (lineIsStatement(line)) {
        switch (line.keyword) {
          case (keywords.BEGIN): {
            programData.name = line.program;
            break;
          }

          case (keywords.CALL): {
            const proc = references.find((ref) => ref.name === line.name);
            if (!proc) {
              errors.reference.procDoesNotExist(line.name);
            }

            await doBlock(proc.block, { memScope, refs });
            break;
          }

          case (keywords.ECHO): {
            const echoArgument = await evaluateExpression(line.arguments[0]);
            echo(echoArgument.value);
            break;
          }

          case (keywords.EXIT): {
            i = block.length;
            break;
          }

          case (keywords.FUNC): {
            if (refs.find((ref) => ref.name === line.name)) {
              errors.reference.funcAlreadyExists(line.name);
            }

            refs.push({
              type: 'function',
              name: line.name,
              returnType: line.returnType,
              parameters: line.parameters,
              block: line.block,
            });
            break;
          }

          case (keywords.IF): {
            if (await evaluateExpression(line.condition).value) {
              await doBlock(line.block, { memScope, refs });
            }
            break;
          }

          case (keywords.INPUT): {
            const mem = memory.mget(memScope, line.variable.value);
            if (typeof mem === 'undefined') {
              errors.reference.variableDoesNotExist(memScope, line.variable.value);
            }

            if (mem.type !== types.String) {
              errors.type.inputMismatch(memScope, line.variable.value);
            }

            stdout.write(`${line.prompt.value} `);
            const input = await getInput();

            memory.massign(memScope, line.variable.value, {
              type: types.String,
              value: input,
            });

            break;
          }

          case (keywords.LET): {
            if (line.variable.type === 'prop') {
              const parentName = line.variable.parent.value;
              const parent = memory.mget(memScope, parentName);
              if (!parent) {
                errors.reference.variableDoesNotExist(memScope, line.variable.parent.value);
              }

              const getStructPropFromParent = (propName) => {
                const structName = getStructType(parent);
                return structs[structName].props.find((prop) => prop.value === propName);
              };

              const evaledChildName = (await evaluateExpression(line.variable.prop)).value;

              if (isStruct(parent) && !getStructPropFromParent(evaledChildName)) {
                errors.reference.structInvalidProp(getStructType(parent), parentName, evaledChildName);
              }

              const evaledChildValue = await evaluateExpression(line.expression);

              if (isStruct(parent) && evaledChildValue.type !== getStructPropFromParent(evaledChildName).dataType) {
                errors.type.assignmentMismatch(memScope, `${parentName}["${evaledChildName}"]`, evaledChildValue.type);
              }

              // This only works because of JS references. I should convert this to separate memory
              // locations to allow infinite nesting and multilingual compilation.
              parent.value[evaledChildName] = evaledChildValue;
              break;
            }

            const mem = memory.mget(memScope, line.variable.value);

            // I could also try/catch an massign here
            if (typeof mem === 'undefined') {
              errors.reference.variableDoesNotExist(memScope, line.variable.value);
            }

            const arrayType = getArrayType(mem);
            const evaledVariable = await evaluateExpression(line.expression);

            if (
              isRawArray(evaledVariable)
              && Array.isArray(evaledVariable.value)
            ) {
              // Empty arrays can be any type
              if (evaledVariable.value.length === 0) {
                evaledVariable.type = mem.type;
              } else {
                if (evaledVariable.value.some((elem) => !isType(arrayType, elem))) {
                  errors.type.assignmentMismatch(memScope, line.variable.value, evaledVariable.type);
                }

                evaledVariable.type = mem.type;
              }
            } else if (
              isArray(evaledVariable)
              && Array.isArray(evaledVariable.value)
            ) {
              // Check type of each element
              if (evaledVariable.value.some((elem) => !isType(arrayType, elem))) {
                errors.type.assignmentMismatch(memScope, line.variable.value, evaledVariable.type);
              }
            } else if (mem.type !== evaledVariable.type) {
              errors.type.assignmentMismatch(memScope, line.variable.value, evaledVariable.type);
            }

            memory.massign(memScope, line.variable.value, evaledVariable);

            break;
          }

          case (keywords.PAUSE): {
            await pause(line.arguments[0]);
            break;
          }

          case (keywords.PROC): {
            if (refs.find((ref) => ref.name === line.name)) {
              errors.reference.procAlreadyExists(line.name);
            }

            refs.push({
              type: 'procedure',
              name: line.name,
              block: line.block,
            });
            break;
          }

          case (keywords.REM): {
            break;
          }

          case (keywords.RETURN): {
            const result = await evaluateExpression(line.expression);
            return result;
          }

          case (keywords.STRUCT): {
            if (structs[line.name.value]) {
              errors.reference.structAlreadyExists(line.name);
            }

            structs[line.name.value] = {
              name: line.name.value,
              props: line.props.map((prop) => ({
                ...prop,
                dataType: typesByTypeKeywords[prop.dataType],
              })),
            };

            break;
          }

          case (keywords.VAR): {
            if (typeof memory.mget(memScope, line.variable.value) !== 'undefined') {
              errors.reference.variableAlreadyExists(line.variable.name);
            }

            if (line.variable.dataType.type === types.Struct) {
              memory.malloc(memScope, line.variable.value, `struct<${line.variable.dataType.value}>`);
            } else if (line.variable.dataType.type === types.Array) {
              memory.malloc(memScope, line.variable.value, `array<${line.variable.dataType.value}>`);
            } else {
              memory.malloc(memScope, line.variable.value, typesByTypeKeywords[line.variable.dataType]);
            }
            memory.massign(memScope, line.variable.value, null);
            break;
          }

          case (keywords.WHILE): {
            let condition = await evaluateExpression(line.condition);
            while (condition.value) {
              await doBlock(line.block, { memScope, refs });
              condition = await evaluateExpression(line.condition);
            }
            break;
          }

          default:
            errors.syntax.keywordNotRecognized(line.keyword);
        }
      }

      stackTrace.pop();
    }
  };

  try {
    stackTrace.push(ast.result);
    await doBlock(ast.result.statements);
  } catch (err) {
    // stderr.write(`\nstack trace\n${JSON.stringify(stackTrace, null, 2)}`);
    // stderr.write(`\nmemory\n${heap}`);
    // stderr.write(`\nreferences\n${JSON.stringify(references, null, 2)}`);
    stderr.write(`\ncaught error\n${err.toString()}`);
  } finally {
    // console.log('DONE.');
  }
};

module.exports = interpret;
