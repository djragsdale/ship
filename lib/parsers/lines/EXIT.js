const {
  possibly,
  sequenceOf,
} = require('arcsecond');

const {
  exitKeyword,
} = require('../keywords');
const {
  stringValue,
} = require('../primitives');
const {
  space,
} = require('../specialCharacters');

const exitLine = sequenceOf([
  exitKeyword,
  possibly(space),
  possibly(stringValue),
])
  .map(([keyword,, program]) => ({
    type: 'statement',
    keyword,
    program: program && program.value,
  }));

module.exports = exitLine;
