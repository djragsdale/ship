const {
  choice,
  many,
  possibly,
  recursiveParser,
  sequenceOf,
} = require('arcsecond');

const {
  newLine,
} = require('./parsers/specialCharacters');
const beginLine = require('./parsers/lines/BEGIN');
const exitLine = require('./parsers/lines/EXIT');

const simpleCodeLine = require('./parsers/lines/simpleCodeLine');

const funcBlock = require('./parsers/blocks/FUNC');
const ifBlock = require('./parsers/blocks/IF');
const procBlock = require('./parsers/blocks/PROC');
const whileBlock = require('./parsers/blocks/WHILE');

const codeLine = recursiveParser(() => (choice([
  simpleCodeLine,
  ifBlock,
  whileBlock,
  procBlock,
  funcBlock,
])));

const blockParser = sequenceOf([
  // BEGIN
  sequenceOf([
    beginLine,
    possibly(many(newLine)),
  ])
    .map(([line]) => line),
  // Everything in between
  many(
    sequenceOf([
      codeLine,
      possibly(many(newLine)),
    ])
      .map(([line]) => line),
  ),
  // EXIT
  sequenceOf([
    exitLine,
    possibly(many(newLine)),
  ])
    .map(([line]) => line),
])
  .map(([parsedBeginLine, lines, parsedExitLine]) => ([
    parsedBeginLine,
    ...lines,
    parsedExitLine,
  ]))
  .map((statements) => ({
    type: 'program',
    statements,
  }));

const Parser = blockParser;

module.exports = Parser;
