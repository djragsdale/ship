const {
  sequenceOf,
} = require('arcsecond');

const {
  pauseKeyword,
} = require('../keywords');
const {
  space,
} = require('../specialCharacters');
const {
  floatStatement,
} = require('../statements');

const pauseLine = sequenceOf([
  pauseKeyword,
  space,
  floatStatement,
])
  .map(([keyword,, arg]) => ({
    type: 'statement',
    keyword,
    arguments: [arg],
  }));

module.exports = pauseLine;
