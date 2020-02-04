const createStruct = require('../createStruct');

module.exports = ({ structs }) => async (expr) => {
  if (expr.type !== 'struct') return null;

  if (!structs[expr.value]) {
    throw new Error(`Struct "${expr.value}" does not exist.`);
  }

  return createStruct(structs[expr.value]);
};
