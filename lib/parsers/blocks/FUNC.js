const {
  choice,
  many1,
  possibly,
  sequenceOf,
  whitespace,
} = require('arcsecond');

const debug = require('../../debug');

const ifBlock = require('./IF');
const whileBlock = require('./WHILE');
const endFuncLine = require('../lines/ENDFUNC');
const funcLine = require('../lines/FUNC');
const returnLine = require('../lines/RETURN');
const simpleCodeLine = require('../lines/simpleCodeLine');
const {
  newLine,
} = require('../specialCharacters');

// Should functions be able to contain other functions?
// They're scoped so function names shouldn't collide with external function names.
const funcBlock = sequenceOf([
  funcLine,
  newLine,
  possibly(whitespace),
  many1(
    sequenceOf([
      choice([
        returnLine,
        simpleCodeLine,
        ifBlock,
        whileBlock,
      ]),
      newLine,
      possibly(whitespace),
    ]).map(([stmt]) => stmt),
  ),
  endFuncLine,
]).map(([w,,, block]) => ({
  ...w,
  block,
}));

module.exports = funcBlock;
