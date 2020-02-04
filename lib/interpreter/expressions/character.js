module.exports = ({ types }) => async (expr) => {
  if (expr.type !== types.Character) return null;

  return {
    type: types.Character,
    value: expr.value,
  };
};
