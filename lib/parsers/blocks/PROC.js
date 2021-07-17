const {
  choice,
  many1,
  possibly,
  sequenceOf,
  whitespace,
} = require('arcsecond');

const ifBlock = require('./IF');
const whileBlock = require('./WHILE');
const endProcLine = require('../lines/ENDPROC');
const procLine = require('../lines/PROC');
const noMemoryLine = require('../lines/noMemoryLine');
const {
  newLine,
} = require('../specialCharacters');

const procBlock = sequenceOf([
  procLine,
  sequenceOf([
    newLine,
    possibly(whitespace),
    many1(
      sequenceOf([
        choice([
          noMemoryLine,
          ifBlock,
          whileBlock,
        ]),
        newLine,
        possibly(whitespace),
      ]).map(([stmt]) => stmt),
    ),
  ]).map(([,, line]) => line),
  endProcLine,
]).map(([w, block]) => ({
  ...w,
  block,
}));

module.exports = procBlock;
