const {
  sequenceOf,
} = require('arcsecond');

const {
  varKeyword,
} = require('../keywords');
const {
  space,
  variableName,
} = require('../specialCharacters');

const varLine = sequenceOf([
  varKeyword,
  space,
  variableName,
])
  .map(([keyword,, varName]) => ({
    type: 'statement',
    keyword,
    variable: varName,
  }));

module.exports = varLine;
