const {
  choice,
  many1,
  sequenceOf,
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
    many1(
      sequenceOf([
        choice([
          noMemoryLine,
          ifBlock,
          whileBlock,
        ]),
        newLine,
      ]).map(([stmt]) => stmt),
    ),
  ]).map(([, line]) => line),
  endProcLine,
]).map(([w, block]) => ({
  ...w,
  block,
}));

module.exports = procBlock;
