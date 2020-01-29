const {
  choice,
  sequenceOf,
} = require('arcsecond');

const {
  expression,
} = require('../expressions');
const {
  returnKeyword,
} = require('../keywords');
const {
  primitive,
} = require('../primitives');
const {
  space,
} = require('../specialCharacters');

const returnLine = sequenceOf([
  returnKeyword,
  space,
  choice([
    primitive,
    expression,
  ]),
])
  .map(([keyword,, expr]) => ({
    type: 'statement',
    keyword,
    expression: expr,
  }));

module.exports = returnLine;
