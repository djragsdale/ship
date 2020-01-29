const {
  choice,
} = require('arcsecond');

const noMemoryLine = require('./noMemoryLine');
const varLine = require('./VAR');

const simpleCodeLine = choice([
  noMemoryLine,
  varLine,
]);

module.exports = simpleCodeLine;
