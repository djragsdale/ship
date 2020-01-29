const {
  sequenceOf,
} = require('arcsecond');

const {
  endFuncKeyword,
} = require('../keywords');

const endFuncLine = sequenceOf([
  endFuncKeyword,
])
  .map(([keyword]) => ({
    type: 'statement',
    keyword,
  }));

module.exports = endFuncLine;
