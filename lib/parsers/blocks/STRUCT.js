const {
  between,
  char,
  sequenceOf,
  // str,
} = require('arcsecond');

const {
  structKeyword,
} = require('../keywords');
const {
  newLine,
  space,
  structName,
  structProp,
} = require('../specialCharacters');

const structBlock = sequenceOf([
  structKeyword,
  space,
  structName,
  space,
  between(
    sequenceOf([char('('), newLine]),
  )(sequenceOf([char(')'), newLine]))(
    sequenceOf([
      space,
      space,
      structProp,
      newLine,
    ]),
  ),
]);

module.exports = structBlock;
