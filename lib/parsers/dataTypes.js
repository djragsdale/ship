const {
  choice,
  str,
} = require('arcsecond');

const typeKeywords = require('../constants/typeKeywords');
const types = require('../constants/types');
const { mapToDataTypeName } = require('./mappers');

const booleanTypeKeyword = str(typeKeywords[types.Boolean]).map(mapToDataTypeName);
const characterTypeKeyword = str(typeKeywords[types.Character]).map(mapToDataTypeName);
const floatTypeKeyword = str(typeKeywords[types.Float]).map(mapToDataTypeName);
const stringTypeKeyword = str(typeKeywords[types.String]).map(mapToDataTypeName);
const arrayTypeKeyword = str(typeKeywords[types.Array]).map(mapToDataTypeName);

const typeKeyword = choice([
  booleanTypeKeyword,
  characterTypeKeyword,
  floatTypeKeyword,
  stringTypeKeyword,
  arrayTypeKeyword,
]);

module.exports = {
  typeKeyword,
  booleanTypeKeyword,
  characterTypeKeyword,
  floatTypeKeyword,
  stringTypeKeyword,
  arrayTypeKeyword,
};
