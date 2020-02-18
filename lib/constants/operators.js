const operators = {
  LESS_THAN: '<',
  GREATER_THAN: '>',
  EQUAL_TO: '==',
  NOT_EQUAL_TO: '!=',

  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: '*',
  DIVIDE: '/',
  MOD: '%',
  POWER: '^',

  CONCAT: '&',
  ACCESS: '->', // TODO: Refactor to METHOD
  PREFIX: ':',
  ASSIGN: '=',
};

module.exports = operators;
