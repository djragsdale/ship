const {
  many1,
  possibly,
  sequenceOf,
  whitespace,
} = require('arcsecond');

const elseLine = require('../lines/ELSE');
const endIfLine = require('../lines/ENDIF');
const ifLine = require('../lines/IF');
const noMemoryLine = require('../lines/noMemoryLine');
const {
  newLine,
} = require('../specialCharacters');

const ifBlock = sequenceOf([
  ifLine,
  sequenceOf([
    newLine,
    possibly(whitespace),
    many1(
      sequenceOf([
        noMemoryLine,
        newLine,
        possibly(whitespace),
      ]).map(([nml]) => nml),
    ),
  ]).map(([,, line]) => line),
  possibly(sequenceOf([
    elseLine,
    newLine,
    possibly(whitespace),
    many1(
      sequenceOf([
        noMemoryLine,
        newLine,
        possibly(whitespace),
      ]).map(([nml]) => nml),
    ),
  ]).map(([,,, line]) => line)),
  endIfLine,
]).map(([w, ifb, eb]) => ({
  ...w,
  block: ifb,
  elseBlock: eb,
}));

module.exports = ifBlock;
