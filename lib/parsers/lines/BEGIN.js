const {
  sequenceOf,
} = require('arcsecond');

const {
  beginKeyword,
} = require('../keywords');
const {
  space,
} = require('../specialCharacters');
const {
  stringStatement,
} = require('../statements');

const beginLine = sequenceOf([
  beginKeyword,
  space,
  stringStatement,
])
  .map(([keyword,, program]) => ({
    type: 'statement',
    keyword,
    program: program && program.value,
  }));

module.exports = beginLine;
