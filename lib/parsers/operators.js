const {
  char,
  choice,
  str,
} = require('arcsecond');

const { mapToOperator } = require('./mappers');
const operators = require('../constants/operators');

// Operators
// - Assignment
const equalsOp = char('=').map(mapToOperator);
const assignOperator = choice([
  equalsOp,
]);
// - Grouping
const startGroupOp = char('(').map(mapToOperator);
const endGroupOp = char(')').map(mapToOperator);
const groupOperator = choice([
  startGroupOp,
  endGroupOp,
]);
// - Arithmetic
const addOp = char(operators.ADD).map(mapToOperator);
const subtractOp = char(operators.SUBTRACT).map(mapToOperator);
const multiplyOp = char(operators.MULTIPLY).map(mapToOperator);
const divideOp = char(operators.DIVIDE).map(mapToOperator);
const modOp = char(operators.MOD).map(mapToOperator);
const powerOp = char(operators.POWER).map(mapToOperator);
const arithmeticOperator = choice([
  addOp,
  subtractOp,
  multiplyOp,
  divideOp,
  modOp,
  powerOp,
]);
// - Array
const concatOp = char(operators.CONCAT).map(mapToOperator);
const arrayOperator = choice([
  concatOp,
]);
// - Boolean
const lessThanOp = char(operators.LESS_THAN).map(mapToOperator);
const greaterThanOp = char(operators.GREATER_THAN).map(mapToOperator);
const equalToOp = str(operators.EQUAL_TO).map(mapToOperator);
const notEqualToOp = str(operators.NOT_EQUAL_TO).map(mapToOperator);
const booleanOperator = choice([
  lessThanOp,
  greaterThanOp,
  equalToOp,
  notEqualToOp,
]);
// - String
const stringOperator = choice([
  concatOp,
]);
// - Struct
const accessOp = str(operators.ACCESS).map(mapToOperator);

module.exports = {
  equalsOp,
  assignOperator,
  startGroupOp,
  endGroupOp,
  groupOperator,
  addOp,
  subtractOp,
  multiplyOp,
  divideOp,
  modOp,
  powerOp,
  arithmeticOperator,
  concatOp,
  arrayOperator,
  lessThanOp,
  greaterThanOp,
  equalToOp,
  notEqualToOp,
  booleanOperator,
  stringOperator,
  accessOp,
};
