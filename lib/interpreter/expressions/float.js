const parseFloat = (f) => Number(`${f[0]}.${f[2] || '0'}`);

module.exports = ({ types }) => async (expr) => {
  if (expr.type !== types.Float) return null;

  return {
    type: types.Float,
    value: parseFloat(expr.value),
  };
};
