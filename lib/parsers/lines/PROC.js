const {
  sequenceOf,
} = require('arcsecond');

const {
  procKeyword,
} = require('../keywords');
const {
  procName,
  space,
} = require('../specialCharacters');

const procLine = sequenceOf([
  procKeyword,
  space,
  procName,
])
  .map(([keyword,, name]) => ({
    type: 'statement',
    keyword,
    name,
  }));

module.exports = procLine;
