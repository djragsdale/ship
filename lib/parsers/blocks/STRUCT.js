const {
  between,
  char,
  many,
  many1,
  // possibly,
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
  many(newLine),
  structKeyword,
  space,
  structName,
  space,
  between(
    sequenceOf([char('('), newLine]),
  )(sequenceOf([char(')'), newLine]))(
    many1(sequenceOf([
      space,
      space,
      structProp,
      newLine,
    ])),
  ),
])
  .map(([, keyword,, name,, props]) => ({
    type: 'statement',
    keyword,
    name,
    props: props.map(([,, prop]) => ({
      ...prop,
    })),
  }));

module.exports = structBlock;