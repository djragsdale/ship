const stringToFloat = (str) => {
  const parts = str.split('.');
  const result = [];
  result.push(parts[0]);
  if (parts[1]) {
    result.push('.');
    result.push([].map.call(parts[1], (d) => d));
  }
  return result;
};

module.exports = ({
  evaluateExpression,
  types,
}) => async (parent) => evaluateExpression({
  type: types.Float,
  value: stringToFloat(parent.value),
});
