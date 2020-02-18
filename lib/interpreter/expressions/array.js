const {
  getArrayType,
  isArray,
  isRawArray,
} = require('../typeChecks');

module.exports = ({ evaluateExpression }) => async (expr) => {
  if (!isArray(expr) && !isRawArray(expr)) return null;

  const arrayValues = await Promise.all(expr.value.map((elem) => evaluateExpression(elem)));

  return {
    type: getArrayType(expr),
    value: arrayValues,
  };
};
