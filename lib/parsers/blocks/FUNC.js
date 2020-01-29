const {
  choice,
  many1,
  sequenceOf,
} = require('arcsecond');

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
  sequenceOf([
    newLine,
    many1(
      sequenceOf([
        choice([
          simpleCodeLine,
          ifBlock,
          whileBlock,
          returnLine,
        ]),
        newLine,
      ]).map(([stmt]) => stmt),
    ),
  ]).map(([, line]) => line),
  endFuncLine,
]).map(([w, block]) => ({
  ...w,
  block,
}));

module.exports = funcBlock;
