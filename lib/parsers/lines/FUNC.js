const {
  between,
  possibly,
  sepBy,
  sequenceOf,
} = require('arcsecond');

const {
  funcKeyword,
} = require('../keywords');
const {
  startGroupOp,
  endGroupOp,
} = require('../operators');
const {
  funcName,
  space,
  typing,
  variableName,
} = require('../specialCharacters');

const funcLine = sequenceOf([
  funcKeyword,
  space,
  typing,
  space,
  funcName,
  possibly(space),
  possibly(sepBy(space)(variableName)),
])
  .map(([keyword,, returnType,, name,, parameters]) => ({
    type: 'statement',
    keyword,
    name,
    returnType,
    parameters,
  }));

module.exports = funcLine;
