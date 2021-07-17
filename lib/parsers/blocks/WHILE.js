const {
  choice,
  many1,
  possibly,
  sequenceOf,
  whitespace,
} = require('arcsecond');

// const debug = require('../../debug');
const ifBlock = require('./IF');
const endWhileLine = require('../lines/ENDWHILE');
const whileLine = require('../lines/WHILE');
const noMemoryLine = require('../lines/noMemoryLine');
const {
  newLine,
} = require('../specialCharacters');

const whileBlock = sequenceOf([
  whileLine,
  sequenceOf([
    newLine,
    possibly(whitespace),
    many1(
      sequenceOf([
        choice([
          noMemoryLine,
          ifBlock,
        ]),
        newLine,
        possibly(whitespace),
      ]).map(([stmt]) => stmt),
    ),
  ]).map(([,, line]) => line),
  endWhileLine,
]).map(([w, block]) => ({
  ...w,
  block,
}));

module.exports = whileBlock;
