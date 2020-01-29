const {
  choice,
} = require('arcsecond');

const callLine = require('./CALL');
const echoLine = require('./ECHO');
const inputLine = require('./INPUT');
const letLine = require('./LET');
const pauseLine = require('./PAUSE');
const remLine = require('./REM');

const noMemoryLine = choice([
  callLine,
  echoLine,
  inputLine,
  letLine,
  pauseLine,
  remLine,
]);

module.exports = noMemoryLine;
