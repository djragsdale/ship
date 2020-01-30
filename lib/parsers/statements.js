/* eslint-disable no-unused-vars,prefer-const */

const {
  choice,
  everythingUntil,
  sequenceOf,
  str,
} = require('arcsecond');

const debug = require('../debug');
const {
  // arithmeticExpression,
  arrayValue,
  // booleanExpression,
  // stringExpression,
  expression,
} = require('./expressions');
const {
  mapToComment,
} = require('./mappers');
const {
  accessOp,
} = require('./operators');
const {
  booleanValue,
  characterValue,
  floatValue,
  stringValue,
} = require('./primitives');
const {
  newLine,
  space,
  variableName,
} = require('./specialCharacters');
const types = require('../constants/types');

// Built-in methods
// Methods categorized by return values
let methodReturningArray;
let methodReturningBoolean;
let methodReturningCharacter;
let methodReturningFloat;
let methodReturningString;
const arrayLenMethod = sequenceOf([
  choice([
    variableName,
    arrayValue,
    // arrayMethod,
  ]),
  accessOp,
  str('len'),
])
  .map(([parent, op, method]) => ({
    type: 'method',
    returnType: types.Float,
    parent,
    method,
    arguments: [],
    operator: op,
  }));
const arraySliceMethod = sequenceOf([
  choice([
    variableName,
    arrayValue,
    // arrayMethod,
  ]),
  accessOp,
  str('slice'),
  space,
  arrayValue,
])
  .map(([parent, op, method, , args]) => ({
    type: 'method',
    returnType: types.Array,
    parent,
    method,
    arguments: args,
    operator: op,
  }));
const charToStringMethod = sequenceOf([
  choice([
    characterValue,
    variableName,
    // characterMethod,
  ]),
  accessOp,
  str('str'),
])
  .map(([parent, op, method]) => ({
    type: 'method',
    returnType: types.String,
    parent,
    method,
    arguments: [],
    operator: op,
  }));
const stringLenMethod = sequenceOf([
  choice([
    variableName,
    expression, // stringExpression,
    stringValue,
    // stringMethod,
  ]),
  accessOp,
  str('len'),
])
  .map(([parent, op, method]) => ({
    type: 'method',
    returnType: types.Float,
    parent,
    method,
    arguments: [],
    operator: op,
  }));
const stringCharMethod = sequenceOf([
  choice([
    variableName,
    expression, // stringExpression,
    stringValue,
    // stringMethod,
  ]),
  accessOp,
  str('char'),
  space,
  arrayValue,
])
  .map(([parent, op, method, , args]) => ({
    type: 'method',
    returnType: types.Character,
    parent,
    method,
    arguments: args,
    operator: op,
  }));
const stringSliceMethod = sequenceOf([
  choice([
    variableName, // .map(debug('checking variable name')),
    expression, // stringExpression, // .map(debug('checking string expression')),
    stringValue, // .map(debug('checking string value')),
    // stringMethod,
  ]), // .map(debug('string expr')),
  accessOp, // .map(debug('access op')),
  str('slice'),
  space,
  arrayValue, // .map(debug('slice array')).map(debug('matched string slice')),
])
  .map(([parent, op, method, , args]) => ({
    type: 'method',
    returnType: types.String,
    parent,
    method,
    arguments: args,
    operator: op,
  }));

// Methods categorized by return values
methodReturningArray = choice([
  arrayLenMethod,
  arraySliceMethod,
]);

methodReturningBoolean = choice([
  // TODO: string to boolean "TRUE" or "FALSE"
  // TODO: float to boolean "1" or "0", only check first part of float
]);

methodReturningCharacter = choice([
  stringCharMethod,
]);

methodReturningFloat = choice([
  arrayLenMethod,
  stringLenMethod,
]);

methodReturningString = choice([
  charToStringMethod,
  stringSliceMethod,
]);


const booleanStatement = choice([
  // Methods parsed first
  // methodReturningBoolean,
  expression, // booleanExpression,
  booleanValue,
  // TODO: Determine valid boolean statement
]);
const characterStatement = choice([
  // Methods parsed first
  methodReturningCharacter,
  characterValue,
  variableName,
]);
const stringStatement = choice([
  // Methods parsed first
  methodReturningString,
  stringValue,
  variableName, // TODO: Check that variable is type string
]);
const floatStatement = choice([
  // Methods parsed first
  methodReturningFloat,
  expression, // arithmeticExpression,
  variableName,
  floatValue,
]);
const arrayStatement = choice([
  // Methods parsed first
  methodReturningArray,
  arrayValue,
  variableName,
]);
const anyStatement = choice([
  booleanStatement,
  characterStatement,
  stringStatement,
  floatStatement,
  arrayStatement,
]);
const commentStatement = everythingUntil(newLine).map(mapToComment);

module.exports = {
  booleanStatement,
  characterStatement,
  stringStatement,
  floatStatement,
  arrayStatement,
  anyStatement,
  commentStatement,
};
