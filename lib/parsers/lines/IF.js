const {
  sequenceOf,
} = require('arcsecond');

const {
  ifKeyword,
} = require('../keywords');
const {
  space,
} = require('../specialCharacters');
const {
  booleanStatement,
} = require('../statements');

const ifLine = sequenceOf([
  ifKeyword,
  space,
  booleanStatement,
])
  .map(([keyword,, condition]) => ({
    type: 'statement',
    keyword,
    condition,
  }));

module.exports = ifLine;
