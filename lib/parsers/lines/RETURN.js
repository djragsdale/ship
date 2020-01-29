const {
  sequenceOf,
} = require('arcsecond');

const {
  expression,
} = require('../expressions');
const {
  returnKeyword,
} = require('../keywords');
const {
  space,
} = require('../specialCharacters');

const returnLine = sequenceOf([
  returnKeyword,
  space,
  expression,
])
  .map(([keyword,, expr]) => ({
    type: 'statement',
    keyword,
    expression: expr,
  }));

module.exports = returnLine;
