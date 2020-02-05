const {
  char,
  choice,
  digit,
  letter,
  many1,
  sequenceOf,
} = require('arcsecond');

// const debug = require('../debug');
const {
  typeKeyword,
} = require('./dataTypes');
const {
  mapToFuncName,
  mapToNull,
  mapToProcName,
  mapToStructName,
  mapToStructProp,
  mapToVariableName,
} = require('./mappers');

// Special characters
const newLine = char('\n').map(mapToNull);
const quote = char('"');
const singleQuote = char('\'');
const space = char(' ').map(mapToNull);
const arrLeft = char('[');
const arrRight = char(']');
// TODO: Make sure name isn't in keywords or just a number
// Also parses struct names
const funcOrProcName = sequenceOf([
  choice([
    letter,
    digit,
  ]),
  many1(choice([
    letter,
    digit,
  ])).map((l) => l.join('')),
])
  .map((x) => x.join(''));
const funcName = funcOrProcName.map(mapToFuncName);
const procName = funcOrProcName.map(mapToProcName);
const structName = funcOrProcName.map(mapToStructName);
const structProp = funcOrProcName.map(mapToStructProp);
const typing = choice([
  typeKeyword,
  structName,
]);
const variableName = sequenceOf([
  char('$'),
  many1(choice([
    letter,
    digit,
  ])).map((l) => l.join('')),
])
  .map((x) => x.join(''))
  .map(mapToVariableName);
  // .map(debug('variable name'));
const symbol = choice([
  char('!'),
  char('@'),
  char('#'),
  char('$'),
  char('%'),
  char('^'),
  char('&'),
  char('*'),
  char('('),
  char(')'),
  char(','),
  char('.'),
  char('\''),
  char('?'),
  char('/'),
  char(';'),
  char(':'),
  char('-'),
  char('='),
  char('_'),
  char('+'),
  char('|'),
]);

module.exports = {
  arrLeft,
  arrRight,
  newLine,
  quote,
  singleQuote,
  space,
  funcOrProcName,
  funcName,
  procName,
  structName,
  structProp,
  typing,
  variableName,
  symbol,
};
