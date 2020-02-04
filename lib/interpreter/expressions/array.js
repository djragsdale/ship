module.exports = ({ evaluateExpression, types }) => async (expr) => {
  if (expr.type !== types.Array) return null;

  const arrayValues = await Promise.all(expr.value.map((elem) => evaluateExpression(elem)));

  return {
    type: types.Array,
    value: arrayValues,
  };
};
