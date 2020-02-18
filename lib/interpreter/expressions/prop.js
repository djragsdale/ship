const errors = require('../errors');

module.exports = ({
  evaluateExpression,
  memScope,
  memory,
}) => async (expr) => {
  // TODO: Verify array types are handled properly here
  if (expr.type !== 'prop') return null;

  const parentName = expr.parent.value;
  const parent = memory.mget(memScope, parentName);
  if (!parent) {
    errors.reference.propOfUndefined(expr.parent.value, expr.prop.value);
  }

  const childName = (await evaluateExpression(expr.prop)).value;
  return parent.value[childName];
};
