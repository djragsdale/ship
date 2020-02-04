module.exports = ({ mem }) => async (expr) => {
  if (expr.type !== 'variable') return null;

  return mem[expr.value];
};
