const {
  sequenceOf,
} = require('arcsecond');

const {
  endIfKeyword,
} = require('../keywords');

const endIfLine = sequenceOf([
  endIfKeyword,
])
  .map(([keyword]) => ({
    type: 'statement',
    keyword,
  }));

module.exports = endIfLine;
