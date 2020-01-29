const {
  sequenceOf,
} = require('arcsecond');

const { remKeyword } = require('../keywords');
const { space } = require('../specialCharacters');
const {
  commentStatement,
} = require('../statements');

const remLine = sequenceOf([
  remKeyword,
  space,
  commentStatement,
])
  .map(([keyword,, statement]) => ({
    type: 'statement',
    keyword,
    statement,
  }));

module.exports = remLine;
