const {
  choice,
  many,
  possibly,
  recursiveParser,
  sequenceOf,
  whitespace,
} = require('arcsecond');

// const debug = require('./debug');
const {
  newLine,
} = require('./parsers/specialCharacters');
const beginLine = require('./parsers/lines/BEGIN');
const exitLine = require('./parsers/lines/EXIT');
const remLine = require('./parsers/lines/REM');

const simpleCodeLine = require('./parsers/lines/simpleCodeLine');

const funcBlock = require('./parsers/blocks/FUNC');
const ifBlock = require('./parsers/blocks/IF');
const procBlock = require('./parsers/blocks/PROC');
const structBlock = require('./parsers/blocks/STRUCT');
const whileBlock = require('./parsers/blocks/WHILE');

const codeLine = recursiveParser(() => (choice([
  simpleCodeLine,
  ifBlock,
  whileBlock,
  procBlock,
  funcBlock,
])));

const blockParser = sequenceOf([
  possibly(many(choice([
    newLine,
    remLine,
    structBlock,
  ]))),
  // BEGIN
  sequenceOf([
    beginLine,
    possibly(many(newLine)),
  ])
    .map(([line]) => line),
  // Everything in between
  many(
    sequenceOf([
      possibly(whitespace),
      codeLine,
      possibly(many(newLine)),
    ])
      .map(([, line]) => line),
  ),
  // EXIT
  sequenceOf([
    exitLine,
    possibly(many(newLine)),
  ])
    .map(([line]) => line),
])
  .map(([structs, parsedBeginLine, lines, parsedExitLine]) => ([
    ...structs,
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
