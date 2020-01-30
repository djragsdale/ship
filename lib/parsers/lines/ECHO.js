const {
  choice,
  sequenceOf,
} = require('arcsecond');

const {
  expression,
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
    expression,
  ]),
])
  .map(([keyword, , statement]) => ({
    type: 'statement',
    keyword,
    arguments: [statement],
  }));

module.exports = echoLine;
