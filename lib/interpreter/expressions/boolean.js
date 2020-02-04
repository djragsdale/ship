module.exports = ({ types }) => async (expr) => {
  if (expr.type !== types.Boolean) return null;

  return {
    type: types.Boolean,
    value: expr.value === 'True',
  };
};
