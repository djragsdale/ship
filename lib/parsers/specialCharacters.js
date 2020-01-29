const {
  char,
  choice,
  digit,
  digits,
  letter,
  letters,
  many1,
  sequenceOf,
} = require('arcsecond');

const debug = require('../debug');
const {
  mapToFuncName,
  mapToNull,
  mapToProcName,
  mapToVariableName,
} = require('./mappers');

// Special characters
const newLine = char('\n').map(mapToNull);
const quote = char('"');
const singleQuote = char('\'');
const space = char(' ').map(mapToNull);
// TODO: Make sure name isn't in keywords or just a number
const funcOrProcName = many1(choice([
  letters,
  digits,
]));
const funcName = funcOrProcName.map(mapToFuncName);
const procName = funcOrProcName.map(mapToProcName);
const variableName = sequenceOf([
  char('$'),
  many1(choice([
    letter,
    digit,
  ])).map((l) => l.join('')),
]).map((x) => x.join('')).map(mapToVariableName).map(debug('variable name'));
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
  newLine,
  quote,
  singleQuote,
  space,
  funcOrProcName,
  funcName,
  procName,
  variableName,
  symbol,
};
