const {
  anythingExcept,
  between,
  char,
  choice,
  digit,
  digits,
  letter,
  many,
  many1,
  possibly,
  sequenceOf,
  str,
  symbol,
} = require('arcsecond');

const {
  mapToBoolean,
  mapToCharacter,
  mapToFloat,
  mapToString,
} = require('./mappers');
const {
  quote,
  singleQuote,
} = require('./specialCharacters');

// Primitives:
const booleanValue = choice([
  str('True'),
  str('False'),
]).map(mapToBoolean);
const characterValue = between(singleQuote)(singleQuote)(
  choice(letter, digit, symbol),
).map(mapToCharacter);
const floatValue = sequenceOf([
  digits,
  possibly(char('.')),
  possibly(many1(digits)),
]).map(mapToFloat);
const stringValue = between(quote)(quote)(
  // TODO: Handle escaped quotes
  many(anythingExcept(quote)).map((s) => s.join('')), // concat string
).map(mapToString);

const primitive = choice([
  booleanValue,
  characterValue,
  floatValue,
  stringValue,
]);

module.exports = {
  booleanValue,
  characterValue,
  floatValue,
  stringValue,
  primitive,
};
