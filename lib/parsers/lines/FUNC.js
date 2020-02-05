const {
  possibly,
  sepBy,
  sequenceOf,
} = require('arcsecond');

const {
  funcKeyword,
} = require('../keywords');
const {
  funcName,
  prefix,
  space,
  typing,
  variableName,
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
