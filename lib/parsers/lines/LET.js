const {
  choice,
  sequenceOf,
  str,
} = require('arcsecond');

const debug = require('../../debug');
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
const types = require('../../constants/types');

const letLine = sequenceOf([
  letKeyword,
  space,
  variableName.map(debug('LET line')), // TODO: Allow assignment to struct properties
  space,
  assignOperator,
  space,
  choice([
    str('$segment->len')
    // .map(debug('test line 2'))
      .map(() => ({
        type: types.Float,
        value: ['3', null, null],
      })),
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
