const interpret = require('./lib/interpret');
const execute = require('./lib/execute');
const keywords = require('./lib/constants/keywords');
const operators = require('./lib/constants/operators');
const Parser = require('./lib/Parser');

module.exports = {
  interpret,
  execute,
  keywords,
  operators,
  Parser,
};
