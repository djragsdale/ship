const {
  sequenceOf,
} = require('arcsecond');

const {
  procName,
} = require('../dataTypes');
const {
  callKeyword,
} = require('../keywords');
const {
  space,
} = require('../specialCharacters');

const callLine = sequenceOf([
  callKeyword,
  space,
  sequenceOf([procName]),
])
  .map(([keyword,, args]) => ({
    type: 'statement',
    keyword,
    name: args[0],
    arguments: args.slice(1),
  }));

module.exports = callLine;
