const types = require('../constants/types');

const mapToType = (type) => (value) => ({
  type,
  value,
});

// - Boolean
// - Character
// - String
// - Float
// - Array

const mapToNull = mapToType('null');
const mapToOperator = mapToType('operator');
const mapToBoolean = mapToType(types.Boolean);
const mapToCharacter = mapToType(types.Character);
const mapToString = mapToType(types.String);
const mapToFloat = mapToType(types.Float);
const mapToArray = mapToType(types.Array);
const mapToVariableName = mapToType('variable');
const mapToFuncName = (value) => value;
const mapToProcName = (value) => value;
const mapToComment = mapToType('comment');

module.exports = {
  mapToType,
  mapToNull,
  mapToOperator,
  mapToBoolean,
  mapToCharacter,
  mapToString,
  mapToFloat,
  mapToArray,
  mapToVariableName,
  mapToFuncName,
  mapToProcName,
  mapToComment,
};
