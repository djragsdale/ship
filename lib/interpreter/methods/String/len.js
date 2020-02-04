module.exports = ({
  evaluateExpression,
  types,
}) => async (parent) => evaluateExpression({
  type: types.Float,
  value: [`${parent.value.length}`, null, null],
});
