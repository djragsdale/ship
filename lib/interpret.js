const keywords = require('./constants/keywords');
const operators = require('./constants/operators');
const Parser = require('./Parser');
const types = require('./constants/types');

const lineIsStatement = (result) => result.type === 'statement';

const interpret = async (script, {
  stdin = process.stdin,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) => {
  // TODO: Implement stderr
  const programData = {};
  // Scopes create symbols which get their own memory heap
  const heap = {};
  const references = [];

  // TODO: Some sort of a malloc command generates a symbol for the variable name

  const echo = (arg) => {
    const message = arg;
    if (arg.type && arg.type === 'variable') {
      console.log('WHOOPS, look up variable in heap');
    }

    process.stdout.write(`${message}\n`);
  };

  const getInput = () => new Promise((resolve) => {
    let input = '';
    stdin.once('readable', () => {
      input += stdin.read();
      resolve(input.split('\n')[0]);
    });
  });

  const pause = (sec) => new Promise((resolve) => {
    setTimeout(() => resolve(), sec * 1000);
  });

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
    mem = heap,
    refs = references,
  } = {}) => { // eslint-disable-line consistent-return
    if (!block) {
      throw new Error('doBlock requires a block');
    }

    const evaluateExpression = async (expr) => {
      // - Boolean
      // - Character
      // - String
      // - Float
      // - Array

      const parseFloat = (f) => Number(`${f[0]}.${f[2] || '0'}`);

      if (expr.type === types.Boolean) {
        return {
          type: types.Boolean,
          value: expr.value === 'True',
        };
      }
      if (expr.type === types.Character) {
        return {
          type: types.Character,
          value: expr.value,
        };
      }
      if (expr.type === types.String) {
        return {
          type: types.String,
          value: expr.value,
        };
      }
      if (expr.type === types.Float) {
        return {
          type: types.Float,
          value: parseFloat(expr.value),
        };
      }
      if (expr.type === types.Array) {
        const arrayValues = await Promise.all(expr.value.map((elem) => evaluateExpression(elem)));

        return {
          type: types.Array,
          value: arrayValues,
        };
      }

      if (expr.type === 'variable') {
        return mem[expr.value];
      }

      if (expr.type === 'expression') {
        const left = await evaluateExpression(expr.left);
        const right = await evaluateExpression(expr.right);
        const op = expr.operator.value;

        // Boolean
        if (op === operators.LESS_THAN) {
          return {
            type: types.Boolean,
            value: (left.value < right.value),
          };
        }
        if (op === operators.GREATER_THAN) {
          return {
            type: types.Boolean,
            value: (left.value > right.value),
          };
        }
        if (op === operators.EQUAL_TO) {
          return {
            type: types.Boolean,
            value: (left.value === right.value),
          };
        }
        if (op === operators.NOT_EQUAL_TO) {
          return {
            type: types.Boolean,
            value: (left.value !== right.value),
          };
        }

        // Arithmetic
        if (op === operators.ADD) {
          return {
            type: types.Float,
            value: left.value + right.value,
          };
        }
        if (op === operators.SUBTRACT) {
          return {
            type: types.Float,
            value: left.value - right.value,
          };
        }
        if (op === operators.MULTIPLY) {
          return {
            type: types.Float,
            value: left.value * right.value,
          };
        }
        if (op === operators.DIVIDE) {
          return {
            type: types.Float,
            value: left.value / right.value,
          };
        }
        if (op === operators.MOD) {
          return {
            type: types.Float,
            value: left.value % right.value,
          };
        }
        if (op === operators.POWER) {
          let power;
          try {
            power = parseInt(right.value.toString().split('.')[0], 10);
          } catch (err) {
            throw new Error(`Syntax Error: Float ${right.value} is not a valid exponent.`);
          }

          return {
            type: types.Float,
            value: left.value ** power,
          };
        }

        // Concatenation
        if (op === operators.CONCAT) {
          const stringCoerce = (val) => {
            if (val.type === types.Array) {
              return `[${val.value.map(stringCoerce).join(', ')}]`;
            }

            return val.value;
          };

          return {
            type: types.String,
            value: `${stringCoerce(left)}${stringCoerce(right)}`,
          };
        }
      }

      if (expr.type === 'funcCall') {
        const newHeap = {};
        const newRefs = [];
        // Declare parameter variables on heap
        const funcRef = refs
          .find((ref) => ref.name === expr.name);

        // TODO: Handle expr.arguments being type: variable

        const evaluatedArguments = await Promise.all(
          expr.arguments.value.map((val) => evaluateExpression(val)),
        );

        funcRef
          .parameters
          .forEach((param, paramIndex) => {
            newHeap[param] = evaluatedArguments[paramIndex];
          });
        // Add self reference to refs (for recursion)
        newRefs.push(funcRef);

        stackTrace.push(expr);
        const result = await doBlock(funcRef.block, {
          mem: newHeap,
          refs: newRefs,
        });
        stackTrace.pop();
        return result;
      }

      if (expr.type === 'method') {
        // TODO: Extract these methods to separate files of pure functions
        // Extra points if I make them plugins
        const parent = await evaluateExpression(expr.parent);

        // Array built-ins
        if (parent.type === types.Array) {
          if (expr.method === 'len') {
            return {
              type: types.Float,
              value: [`${parent.value.length}`, null, null],
            };
          }

          if (expr.method === 'slice') {
            const args = await evaluateExpression(expr.arguments);

            const [startIdx, endIdx] = args.value.map((a) => a.value);

            return {
              type: types.String,
              value: parent.value.slice(startIdx, endIdx),
            };
          }
        }

        // Character built-ins
        if (parent.type === types.Character) {
          if (expr.method === 'str') {
            return {
              type: types.String,
              value: parent.value,
            };
          }
        }

        // Float built-ins
        // ceil
        // floor

        // String built-ins
        if (parent.type === types.String) {
          if (expr.method === 'char') {
            const args = await evaluateExpression(expr.arguments);

            const [startIdx] = args.value.map((a) => a.value);

            return {
              type: types.Character,
              value: parent.value.substring(startIdx, startIdx + 1),
            };
          }

          if (expr.method === 'len') {
            return {
              type: types.Float,
              value: [`${parent.value.length}`, null, null],
            };
          }

          if (expr.method === 'slice') {
            const args = await evaluateExpression(expr.arguments);

            const [startIdx, endIdx] = args.value.map((a) => a.value);

            return {
              type: types.String,
              value: parent.value.substring(startIdx, endIdx),
            };
          }
        }

        throw new Error(`Syntax Error: Method ${expr.method} is not recognized on type ${parent.type}.`);
      }

      // console.log('some weird expression', expr);
      throw new Error(`Syntax Error: Can't evaluate expression of type ${expr.type}.`);
    };

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
              throw new Error(`Reference Error: Procedure ${line.name} does not exist.`);
            }

            await doBlock(proc.block);
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
              await doBlock(line.block);
            }
            break;
          }

          case (keywords.INPUT): {
            if (typeof heap[line.variable.value] === 'undefined') {
              throw new Error(`Reference Error: Variable ${line.variable.value} does not exist.`);
            }

            stdout.write(`${line.prompt.value} `);
            const input = await getInput();

            heap[line.variable.value] = {
              type: types.String,
              value: input,
            };

            break;
          }

          case (keywords.LET): {
            if (typeof heap[line.variable.value] === 'undefined') {
              throw new Error(`Reference Error: Variable ${line.variable.value} does not exist.`);
            }

            heap[line.variable.value] = await evaluateExpression(line.expression);

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

          case (keywords.VAR): {
            if (typeof heap[line.variable.value] !== 'undefined') {
              throw new Error(`Reference Error: Variable ${line.variable.value} already exists.`);
            }

            heap[line.variable.value] = null;
            break;
          }

          case (keywords.WHILE): {
            while ((await evaluateExpression(line.condition)).value) {
              await doBlock(line.block);
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
    stderr.write('\nstack trace\n', stackTrace);
    stderr.write('\nmemory\n', heap);
    stderr.write('\nreferences\n', references);
    stderr.write('\ncaught error\n', err);
  } finally {
    // console.log('DONE.');
  }
};

module.exports = interpret;
