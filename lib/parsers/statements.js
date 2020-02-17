/* eslint-disable no-unused-vars,prefer-const */

const {
  choice,
  everythingUntil,
} = require('arcsecond');

const {
  variableName,
} = require('./dataTypes');
const {
  arrayValue,
  expression,
} = require('./expressions');
const {
  mapToComment,
} = require('./mappers');
const {
  booleanValue,
  characterValue,
  floatValue,
  stringValue,
} = require('./primitives');
const {
  newLine,
} = require('./specialCharacters');
const types = require('../constants/types');

const booleanStatement = choice([
  // Methods parsed first
  // methodReturningBoolean,
  expression, // booleanExpression,
  booleanValue,
  // TODO: Determine valid boolean statement
]);
const characterStatement = choice([
  // Methods parsed first
  characterValue,
  variableName,
]);
const stringStatement = choice([
  // Methods parsed first
  stringValue,
  variableName, // TODO: Check that variable is type string
]);
const floatStatement = choice([
  // Methods parsed first
  expression, // arithmeticExpression,
  variableName,
  floatValue,
]);
const arrayStatement = choice([
  // Methods parsed first
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
