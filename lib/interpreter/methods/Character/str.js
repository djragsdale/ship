module.exports = ({
  evaluateExpression,
  types,
}) => async (parent) => evaluateExpression({
  type: types.String,
  value: parent.value,
});
