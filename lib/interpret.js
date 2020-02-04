const uuidv4 = require('uuid/v4');

const keywords = require('./constants/keywords');
const Parser = require('./Parser');
const types = require('./constants/types');

const echoFactory = require('./interpreter/io/echo');
const getInputFactory = require('./interpreter/io/getInput');
const memory = require('./interpreter/memory');
const evaluateExpressionFactory = require('./interpreter/evaluateExpression');
const lineIsStatement = require('./interpreter/lineIsStatement');
const pause = require('./interpreter/pause');

// malloc - heap resource allocation
// massign - heap resource assignment
// mget - heap value lookup

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

      // console.log('line', line.keyword);

      if (lineIsStatement(line)) {
        switch (line.keyword) {
          case (keywords.BEGIN): {
            programData.name = line.program;
            break;
          }

          case (keywords.CALL): {
            const proc = references.find((ref) => ref.name === line.name);
            if (!proc) {
              throw new Error(`Reference Error: Procedure ${line.name} does not exist.`);
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
              throw new Error(`Reference Error: Function ${line.name} already exists.`);
            }

            refs.push({
              type: 'function',
              name: line.name,
              parameters: line.parameters.map((p) => p.value),
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
            if (typeof memory.mget(memScope, line.variable.value) === 'undefined') {
              throw new Error(`Reference Error: Variable ${line.variable.value} does not exist for scope ${memScope}.`);
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
                throw new Error(`Reference Error: Variable ${line.variable.parent.value} does not exist for scope ${memScope}.`);
              }

              const evaledChildName = (await evaluateExpression(line.variable.prop)).value;

              if (parent.STRUCT && !structs[parent.STRUCT].props.find((prop) => prop.value === evaledChildName)) {
                throw new Error(`Struct "${parent.STRUCT}" for variable "${parentName}" does not have prop "${evaledChildName}".`);
              }

              // This only works because of JS references. I should convert this to separate memory
              // locations to allow infinite nesting and multilingual compilation.
              parent.value[evaledChildName] = await evaluateExpression(line.expression);
              break;
            }

            // I could also try/catch an massign here
            if (typeof memory.mget(memScope, line.variable.value) === 'undefined') {
              throw new Error(`Reference Error: Variable ${line.variable.value} does not exist for scope ${memScope}.`);
            }

            memory.massign(memScope, line.variable.value, await evaluateExpression(line.expression));

            break;
          }

          case (keywords.PAUSE): {
            await pause(line.arguments[0]);
            break;
          }

          case (keywords.PROC): {
            if (refs.find((ref) => ref.name === line.name)) {
              throw new Error(`Reference Error: Procedure ${line.name} already exists.`);
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
              throw new Error(`Reference Error: Struct ${line.name} already exists.`);
            }

            structs[line.name.value] = {
              name: line.name.value,
              props: line.props,
            };

            break;
          }

          case (keywords.VAR): {
            if (typeof memory.mget(memScope, line.variable.value) !== 'undefined') {
              throw new Error(`Reference Error: Variable ${line.variable.value} already exists.`);
            }

            memory.malloc(memScope, line.variable.value);
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
            throw new Error(`Syntax Error: Keyword ${line.keyword} is not recognized.`);
        }
      }

      stackTrace.pop();
    }
  };

  try {
    stackTrace.push(ast.result);
    await doBlock(ast.result.statements);
  } catch (err) {
    stderr.write(`\nstack trace\n${JSON.stringify(stackTrace, null, 2)}`);
    // stderr.write(`\nmemory\n${heap}`);
    // stderr.write(`\nreferences\n${JSON.stringify(references, null, 2)}`);
    stderr.write(`\ncaught error\n${err.toString()}`);
  } finally {
    // console.log('DONE.');
  }
};

module.exports = interpret;
