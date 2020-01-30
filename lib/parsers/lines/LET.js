const {
  choice,
  sequenceOf,
} = require('arcsecond');

// const debug = require('../../debug');
const {
  arrayValue,
} = require('../expressions');
const {
  letKeyword,
} = require('../keywords');
const {
  assignOperator,
} = require('../operators');
const {
  primitive,
} = require('../primitives');
const {
  space,
  funcName,
  variableName,
} = require('../specialCharacters');
const {
  anyStatement,
} = require('../statements');

const letLine = sequenceOf([
  letKeyword,
  space,
  variableName, // .map(debug('LET line')), // TODO: Allow assignment to struct properties
  space,
  assignOperator,
  space,
  choice([
    // expression, // Swapped expression for anyStatement
    anyStatement,
    primitive,
    sequenceOf([
      funcName,
      space,
      choice([
        arrayValue,
        variableName, // Can pass a variable of an array
      ]),
    ]).map(([name, , args]) => ({
      type: 'funcCall',
      name,
      arguments: args,
    })),
  ]),
])
  .map(([keyword,, varName,, op,, expr]) => ({
    type: 'statement',
    keyword,
    variable: varName,
    operator: op,
    expression: expr,
  }));

module.exports = letLine;
