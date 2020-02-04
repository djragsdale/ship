module.exports = ({
  evaluateExpression,
  types,
}) => async (parent, args) => {
  const [startIdx] = args.value.map((a) => a.value);

  return evaluateExpression({
    type: types.Character,
    value: parent.value.substring(startIdx, startIdx + 1),
  });
};