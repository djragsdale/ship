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
const mapToTypedArray = mapToType('array');
const mapToVariableName = mapToType('variable');
const mapToDataTypeName = (value) => value;
const mapToFuncName = (value) => value;
const mapToProcName = (value) => value;
const mapToStructName = mapToType('struct');
const mapToStructProp = mapToType('prop');
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
  mapToTypedArray,
  mapToVariableName,
  mapToDataTypeName,
  mapToFuncName,
  mapToProcName,
  mapToStructName,
  mapToStructProp,
  mapToComment,
};
