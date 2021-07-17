const types = require('../../constants/types');

const isRawArray = (data) => data && data.type === types.Array;
const isArray = (data) => data.type.startsWith('array<') && data.type.endsWith('>');
const getArrayType = (data) => {
  if (isRawArray(data)) return types.Array;
  return data?.type?.substring(6, data.type.length - 1);
};
const arrayIsType = (type, data) => {
  if (typeof data === 'undefined') return (curriedData) => arrayIsType(type, curriedData);
  if (!isArray(data)) return false;

  return getArrayType(data) === type;
};

const getStructType = (data) => data.type.substring(7, data.type.length - 1);
const isStruct = (data) => data.type.startsWith('struct<') && data.type.endsWith('>');
const structIsType = (type, data) => {
  if (typeof data === 'undefined') return (curriedData) => structIsType(type, curriedData);
  if (!isStruct(data)) return false;

  return getStructType(data) === type;
};

const isBoolean = (data) => data.type === types.Boolean;
const isCharacter = (data) => data.type === types.Character;
const isFloat = (data) => data.type === types.Float;
const isString = (data) => data.type === types.String;

const isType = (type, data) => {
  if (typeof data === 'undefined') return (curriedData) => isType(type, curriedData);
  return data.type === type;
};

module.exports = {
  arrayIsType,
  getArrayType,
  getStructType,
  isArray,
  isBoolean,
  isCharacter,
  isFloat,
  isRawArray,
  isString,
  isStruct,
  isType,
  structIsType,
};
