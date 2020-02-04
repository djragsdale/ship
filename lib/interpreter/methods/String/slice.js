module.exports = ({
  evaluateExpression,
  types,
}) => async (parent, args) => {
  const [startIdx, endIdx] = args.value.map((a) => a.value);

  return evaluateExpression({
    type: types.String,
    value: parent.value.substring(startIdx, endIdx),
  });
};
