const evaluate = require('./lib/evaluate');
const execute = require('./lib/execute');
const keywords = require('./lib/constants/keywords');
const operators = require('./lib/constants/operators');
const Parser = require('./lib/Parser');

module.exports = {
  evaluate,
  execute,
  keywords,
  operators,
  Parser,
};
