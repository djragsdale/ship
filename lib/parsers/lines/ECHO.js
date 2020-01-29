const {
  choice,
  sequenceOf,
} = require('arcsecond');

const {
  stringExpression,
} = require('../expressions');
const {
  echoKeyword,
} = require('../keywords');
const {
  space,
} = require('../specialCharacters');
const {
  stringStatement,
} = require('../statements');

const echoLine = sequenceOf([
  echoKeyword,
  space,
  choice([
    stringStatement,
    stringExpression,
  ]),
])
  .map(([keyword, , statement]) => ({
    type: 'statement',
    keyword,
    arguments: [statement],
  }));

module.exports = echoLine;
