const {
  sequenceOf,
} = require('arcsecond');

const {
  typing,
  variableName,
} = require('../dataTypes');
const {
  varKeyword,
} = require('../keywords');
const {
  space,
} = require('../specialCharacters');

const varLine = sequenceOf([
  varKeyword,
  space,
  typing,
  space,
  variableName,
])
  .map(([keyword,, dataType,, varName]) => ({
    type: 'statement',
    keyword,
    variable: {
      ...varName,
      dataType,
    },
  }));

module.exports = varLine;
