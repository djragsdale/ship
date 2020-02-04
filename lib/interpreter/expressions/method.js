const arrayLen = require('../methods/Array/len');
const arraySlice = require('../methods/Array/slice');
const characterStr = require('../methods/Character/str');
const stringChar = require('../methods/String/char');
const stringLen = require('../methods/String/len');
const stringSlice = require('../methods/String/slice');

module.exports = ({
  evaluateExpression,
  types,
}) => async (expr) => {
  if (expr.type !== 'method') return null;

  // TODO: Extract these methods to separate files of pure functions
  // Extra points if I make them plugins
  const parent = await evaluateExpression(expr.parent);
  let args;
  if (expr.arguments && expr.arguments.length) {
    args = await evaluateExpression(expr.arguments);
  }

  // Array built-ins
  if (parent.type === types.Array) {
    if (expr.method === 'len') {
      return arrayLen({ evaluateExpression, types })(parent, args);
    }

    if (expr.method === 'slice') {
      return arraySlice({ evaluateExpression, types })(parent, args);
    }
  }

  // Character built-ins
  if (parent.type === types.Character) {
    if (expr.method === 'str') {
      return characterStr({ evaluateExpression, types })(parent, args);
    }
  }

  // Float built-ins
  // ceil
  // floor

  // String built-ins
  if (parent.type === types.String) {
    if (expr.method === 'char') {
      return stringChar({ evaluateExpression, types })(parent, args);
    }

    if (expr.method === 'len') {
      return stringLen({ evaluateExpression, types })(parent, args);
    }

    if (expr.method === 'slice') {
      return stringSlice({ evaluateExpression, types })(parent, args);
    }
  }

  throw new Error(`Syntax Error: Method ${expr.method} is not recognized on type ${parent.type}.`);
};
