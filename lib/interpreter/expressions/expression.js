const errors = require('../errors');
const operators = require('../../constants/operators');
const {
  isArray,
  isFloat,
  isRawArray,
} = require('../typeChecks');

module.exports = ({ evaluateExpression, types }) => async (expr) => {
  if (expr.type !== 'expression') return null;

  const left = await evaluateExpression(expr.left);
  const right = await evaluateExpression(expr.right);
  const op = expr.operator.value;

  const booleanTypeCheck = () => {
    if (!isFloat(left) || !isFloat(right)) {
      errors.type.expressionMismatch(left.type, op, right.type);
    }
  };

  // Boolean
  if (op === operators.LESS_THAN) {
    booleanTypeCheck();
    return {
      type: types.Boolean,
      value: (left.value < right.value),
    };
  }
  if (op === operators.GREATER_THAN) {
    booleanTypeCheck();
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

  const arithmeticTypeCheck = () => {
    if (!isFloat(left) || !isFloat(right)) {
      errors.type.expressionMismatch(left.type, op, right.type);
    }
  };

  // Arithmetic
  if (op === operators.ADD) {
    arithmeticTypeCheck();

    return {
      type: types.Float,
      value: left.value + right.value,
    };
  }
  if (op === operators.SUBTRACT) {
    arithmeticTypeCheck();
    return {
      type: types.Float,
      value: left.value - right.value,
    };
  }
  if (op === operators.MULTIPLY) {
    arithmeticTypeCheck();
    return {
      type: types.Float,
      value: left.value * right.value,
    };
  }
  if (op === operators.DIVIDE) {
    arithmeticTypeCheck();
    return {
      type: types.Float,
      value: left.value / right.value,
    };
  }
  if (op === operators.MOD) {
    arithmeticTypeCheck();
    return {
      type: types.Float,
      value: left.value % right.value,
    };
  }
  if (op === operators.POWER) {
    arithmeticTypeCheck();
    let power;
    try {
      power = parseInt(right.value.toString().split('.')[0], 10);
    } catch (err) {
      errors.syntax.floatExponentError(right.value);
    }

    return {
      type: types.Float,
      value: left.value ** power,
    };
  }

  // Concatenation
  if (op === operators.CONCAT) {
    if ((isRawArray(left) || isArray(left)) && (isRawArray(right) || isArray(right))) {
      return {
        type: types.Array,
        value: [...left.value, ...right.value],
      };
    }

    const stringCoerce = (val) => {
      if (isRawArray(val) || isArray(val)) {
        return `[${val.value.map(stringCoerce).join(', ')}]`;
      }

      return val.value;
    };

    return {
      type: types.String,
      value: `${stringCoerce(left)}${stringCoerce(right)}`,
    };
  }

  return errors.syntax.operatorNotRecognized(op);
};
