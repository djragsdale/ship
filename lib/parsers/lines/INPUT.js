const {
  sequenceOf,
} = require('arcsecond');

const {
  inputKeyword,
} = require('../keywords');
const {
  space,
  variableName,
} = require('../specialCharacters');
const {
  stringStatement,
} = require('../statements');

const inputLine = sequenceOf([
  inputKeyword,
  space,
  variableName,
  space,
  stringStatement,
])
  .map(([keyword,, varName,, prompt]) => ({
    type: 'statement',
    keyword,
    variable: varName,
    prompt,
  }));

module.exports = inputLine;
