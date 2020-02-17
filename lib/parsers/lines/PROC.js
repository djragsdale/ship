const {
  sequenceOf,
} = require('arcsecond');

const {
  procName,
} = require('../dataTypes');
const {
  procKeyword,
} = require('../keywords');
const {
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
