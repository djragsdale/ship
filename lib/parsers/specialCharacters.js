const {
  char,
  choice,
} = require('arcsecond');

// const debug = require('../debug');
const {
  PREFIX,
} = require('../constants/operators');
const {
  mapToNull,
} = require('./mappers');

// Special characters
const newLine = char('\n').map(mapToNull);
const prefix = char(PREFIX);
const quote = char('"');
const singleQuote = char('\'');
const space = char(' ').map(mapToNull);
const arrLeft = char('[');
const arrRight = char(']');

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
  prefix,
  quote,
  singleQuote,
  space,
  symbol,
};
