const {
  char,
  choice,
  digit,
  letter,
  many1,
  recursiveParser,
  sequenceOf,
  str,
} = require('arcsecond');

const typeKeywords = require('../constants/typeKeywords');
const types = require('../constants/types');
const {
  mapToDataTypeName,
  mapToFuncName,
  mapToProcName,
  mapToStructName,
  mapToStructProp,
  mapToVariableName,
} = require('./mappers');

// TODO: Make sure name isn't in keywords or just a number
// Also parses struct names
const funcOrProcName = sequenceOf([
  choice([
    letter,
    digit,
  ]),
  many1(choice([
    letter,
    digit,
  ])).map((l) => l.join('')),
])
  .map((x) => x.join(''));
const funcName = funcOrProcName.map(mapToFuncName);
const procName = funcOrProcName.map(mapToProcName);
const structName = funcOrProcName.map(mapToStructName);
const structProp = funcOrProcName.map(mapToStructProp);
const variableName = sequenceOf([
  char('$'),
  many1(choice([
    letter,
    digit,
  ])).map((l) => l.join('')),
])
  .map((x) => x.join(''))
  .map(mapToVariableName);

const booleanTypeKeyword = str(typeKeywords[types.Boolean]).map(mapToDataTypeName);
const characterTypeKeyword = str(typeKeywords[types.Character]).map(mapToDataTypeName);
const floatTypeKeyword = str(typeKeywords[types.Float]).map(mapToDataTypeName);
const stringTypeKeyword = str(typeKeywords[types.String]).map(mapToDataTypeName);

const createArrayTypeKeyword = (type) => sequenceOf([
  str(typeKeywords[types.Array]),
  char('<'),
  choice([
    type,
    structName.map(({ value }) => value),
  ]),
  char('>'),
])
  .map((data) => data.join(''))
  // TODO: Parse array subtypes in the parser
  .map(mapToDataTypeName);

const typeKeyword = recursiveParser(() => choice([
  booleanTypeKeyword,
  characterTypeKeyword,
  floatTypeKeyword,
  stringTypeKeyword,
  createArrayTypeKeyword(typeKeyword),
]));

const typing = choice([
  typeKeyword,
  structName,
]);

module.exports = {
  funcOrProcName,
  funcName,
  procName,
  structName,
  structProp,
  typing,
  variableName,
  typeKeyword,
  booleanTypeKeyword,
  characterTypeKeyword,
  floatTypeKeyword,
  stringTypeKeyword,
  arrayTypeKeyword: createArrayTypeKeyword(typeKeyword),
};
