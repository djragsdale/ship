const {
  choice,
  sequenceOf,
} = require('arcsecond');

// const debug = require('../../debug');
const {
  arrayValue,
  expression,
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
  arrLeft,
  arrRight,
  funcName,
  space,
  structName,
  variableName,
} = require('../specialCharacters');
const {
  anyStatement,
} = require('../statements');

const letLine = sequenceOf([
  letKeyword,
  space,
  choice([
    sequenceOf([
      variableName,
      arrLeft,
      expression,
      arrRight,
    ]).map(([parent,, prop]) => ({
      type: 'prop',
      parent,
      prop,
    })),
    variableName,
  ]),
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
        expression,
        variableName, // Can pass a variable of an array
      ]),
    ]).map(([name,, args]) => ({
      type: 'funcCall',
      name,
      arguments: args,
    })),
    structName,
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
