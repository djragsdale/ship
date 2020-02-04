const operators = require('../../constants/operators');

module.exports = ({ evaluateExpression, types }) => async (expr) => {
  if (expr.type !== 'expression') return null;

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

  throw new Error(`Syntax Error: Operator ${op} is not recognized.`);
};
