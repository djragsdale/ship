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
  space,
  variableName,
} = require('../specialCharacters');

const funcLine = sequenceOf([
  funcKeyword,
  space,
  funcName,
  possibly(space),
  possibly(sepBy(space)(variableName)),
])
  .map(([keyword,, name,, parameters]) => ({
    type: 'statement',
    keyword,
    name,
    parameters,
  }));

module.exports = funcLine;
