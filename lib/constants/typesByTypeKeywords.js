const types = require('./types');

const typesByTypeKeywords = {
  BOOL: types.Boolean,
  CHAR: types.Character,
  STRING: types.String,
  FLOAT: types.Float,
  ARRAY: types.Array,
};

module.exports = typesByTypeKeywords;
