module.exports = ({
  evaluateExpression,
  memScope,
  memory,
}) => async (expr) => {
  if (expr.type !== 'prop') return null;

  const parentName = expr.parent.value;
  const parent = memory.mget(memScope, parentName);
  if (!parent) {
    throw new Error(`Reference Error: Cannot evaluate property "${expr.prop.value}" of undefined "${expr.parent.value}".`);
  }

  const childName = (await evaluateExpression(expr.prop)).value;
  return parent.value[childName];
};
