module.exports = ({
  memScope,
  memory,
}) => async (expr) => {
  if (expr.type !== 'variable') return null;

  return memory.mget(memScope, expr.value);
};
