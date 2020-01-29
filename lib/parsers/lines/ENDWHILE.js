const {
  sequenceOf,
} = require('arcsecond');

const {
  endWhileKeyword,
} = require('../keywords');

const endWhileLine = sequenceOf([
  endWhileKeyword,
])
  .map(([keyword]) => ({
    type: 'statement',
    keyword,
  }));

module.exports = endWhileLine;
