const operators = require('../constants/operators');
const types = require('../constants/types');

const createStruct = require('./createStruct');

const evaluateExpressionFactory = ({
  doBlock,
  mem,
  refs,
  stackTrace,
  structs,
}) => {
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

    if (expr.type === 'struct') {
      if (!structs[expr.value]) {
        throw new Error(`Struct "${expr.value}" does not exist.`);
      }

      return createStruct(structs[expr.value]);
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
          return evaluateExpression({
            type: types.Float,
            value: [`${parent.value.length}`, null, null],
          });
        }

        if (expr.method === 'slice') {
          const args = await evaluateExpression(expr.arguments);

          const [startIdx, endIdx] = args.value.map((a) => a.value);

          return evaluateExpression({
            type: types.String,
            value: parent.value.slice(startIdx, endIdx),
          });
        }
      }

      // Character built-ins
      if (parent.type === types.Character) {
        if (expr.method === 'str') {
          return evaluateExpression({
            type: types.String,
            value: parent.value,
          });
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

          return evaluateExpression({
            type: types.Character,
            value: parent.value.substring(startIdx, startIdx + 1),
          });
        }

        if (expr.method === 'len') {
          return evaluateExpression({
            type: types.Float,
            value: [`${parent.value.length}`, null, null],
          });
        }

        if (expr.method === 'slice') {
          const args = await evaluateExpression(expr.arguments);

          const [startIdx, endIdx] = args.value.map((a) => a.value);

          return evaluateExpression({
            type: types.String,
            value: parent.value.substring(startIdx, endIdx),
          });
        }
      }

      throw new Error(`Syntax Error: Method ${expr.method} is not recognized on type ${parent.type}.`);
    }

    if (expr.type === 'prop') {
      const parentName = expr.parent.value;
      const parent = mem[parentName];
      if (!parent) {
        throw new Error(`Reference Error: Cannot evaluate property "${expr.prop.value}" of undefined "${expr.parent.value}".`);
      }

      const childName = (await evaluateExpression(expr.prop)).value;
      return mem[parentName].value[childName];
    }

    throw new Error(`Syntax Error: Can't evaluate expression of type ${expr.type}.`);
  };

  return evaluateExpression;
};

module.exports = evaluateExpressionFactory;
