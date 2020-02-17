const errors = require('../errors');
const operators = require('../../constants/operators');

module.exports = ({ evaluateExpression, types }) => async (expr) => {
  if (expr.type !== 'expression') return null;

  const isBoolean = (data) => data.type === types.Boolean;
  const isCharacter = (data) => data.type === types.Character;
  const isFloat = (data) => data.type === types.Float;
  const isString = (data) => data.type === types.String;

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

  errors.syntax.operatorNotRecognized(op);
};
