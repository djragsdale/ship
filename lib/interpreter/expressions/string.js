module.exports = ({ types }) => async (expr) => {
  if (expr.type !== types.String) return null;

  return {
    type: types.String,
    value: expr.value,
  };
};
