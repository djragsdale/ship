const {
  sequenceOf,
} = require('arcsecond');

const {
  elseKeyword,
} = require('../keywords');

const elseLine = sequenceOf([
  elseKeyword,
])
  .map(([keyword]) => ({
    type: 'statement',
    keyword,
  }));

module.exports = elseLine;
