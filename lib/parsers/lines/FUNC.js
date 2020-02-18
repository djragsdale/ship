const {
  possibly,
  sepBy,
  sequenceOf,
} = require('arcsecond');

const {
  funcName,
  typing,
  variableName,
} = require('../dataTypes');
const {
  funcKeyword,
} = require('../keywords');
const {
  prefix,
  space,
} = require('../specialCharacters');

const funcLine = sequenceOf([
  funcKeyword,
  space,
  typing,
  prefix,
  funcName,
  possibly(space),
  possibly(sepBy(space)(sequenceOf([
    typing,
    prefix,
    variableName,
  ])
    .map(([dataType,, varName]) => ({
      ...varName,
      dataType,
    })))),
])
  .map(([keyword,, returnType,, name,, parameters]) => ({
    type: 'statement',
    keyword,
    name,
    returnType,
    parameters,
  }));

module.exports = funcLine;
