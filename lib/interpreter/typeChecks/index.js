const types = require('../../constants/types');

const isArray = (data) => data.type.startsWith('array<') && data.type.endsWith('>');
const arrayIsType = (type, data) => {
  if (typeof data === 'undefined') return (curriedData) => arrayIsType(type, curriedData);
  if (!isArray(data)) return false;

  const innerType = data.type.substring(6, data.type.length - 1);
  return innerType === type;
};

const isStruct = (data) => data.type.startsWith('struct<') && data.type.endsWith('>');
const structIsType = (type, data) => {
  if (typeof data === 'undefined') return (curriedData) => structIsType(type, curriedData);
  if (!isStruct(data)) return false;

  const innerType = data.type.substring(7, data.type.length - 1);
  return innerType === type;
};

module.exports = {
  arrayIsType,
  isArray,
  isBoolean: (data) => data.type === types.Boolean,
  isCharacter: (data) => data.type === types.Character,
  isFloat: (data) => data.type === types.Float,
  isString: (data) => data.type === types.String,
  isStruct,
  structIsType,
};
