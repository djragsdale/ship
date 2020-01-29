const {
  possibly,
  sequenceOf,
} = require('arcsecond');

const {
  exitKeyword,
} = require('../keywords');
const {
  space,
} = require('../specialCharacters');
const {
  stringStatement,
} = require('../statements');

const exitLine = sequenceOf([
  exitKeyword,
  possibly(space),
  possibly(stringStatement),
])
  .map(([keyword,, program]) => ({
    type: 'statement',
    keyword,
    program: program && program.value,
  }));

module.exports = exitLine;
