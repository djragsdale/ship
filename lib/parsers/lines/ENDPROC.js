const {
  sequenceOf,
} = require('arcsecond');

const {
  endProcKeyword,
} = require('../keywords');

const endProcLine = sequenceOf([
  endProcKeyword,
])
  .map(([keyword]) => ({
    type: 'statement',
    keyword,
  }));

module.exports = endProcLine;
