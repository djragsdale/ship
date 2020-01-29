const {
  sequenceOf,
} = require('arcsecond');

const {
  whileKeyword,
} = require('../keywords');
const {
  space,
} = require('../specialCharacters');
const {
  booleanStatement,
} = require('../statements');

const whileLine = sequenceOf([
  whileKeyword,
  space,
  booleanStatement,
])
  .map(([keyword,, condition]) => ({
    type: 'statement',
    keyword,
    condition,
  }));

module.exports = whileLine;
