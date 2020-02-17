const errors = require('../errors');

// FIXME: f[2] is an array of digit strings
const parseFloat = (f) => Number(`${f[0]}.${f[2] || '0'}`);

module.exports = ({ types }) => async (expr) => {
  if (expr.type !== types.Float) return null;

  const value = parseFloat(expr.value);

  if (Number.isNaN(value)) {
    errors.syntax.floatParseError(expr.value);
  }

  return {
    type: types.Float,
    value,
  };
};
