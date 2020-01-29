const {
  many1,
  sequenceOf,
} = require('arcsecond');

const endIfLine = require('../lines/ENDIF');
const ifLine = require('../lines/IF');
const noMemoryLine = require('../lines/noMemoryLine');
const {
  newLine,
} = require('../specialCharacters');

// TODO: Handle ELSE
const ifBlock = sequenceOf([
  ifLine,
  sequenceOf([
    newLine,
    many1(
      sequenceOf([
        noMemoryLine,
        newLine,
      ]).map(([nml]) => nml),
    ),
  ]).map(([, line]) => line),
  endIfLine,
]).map(([w, block]) => ({
  ...w,
  block,
}));

module.exports = ifBlock;
