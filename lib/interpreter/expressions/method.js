module.exports = ({
  evaluateExpression,
  types,
}) => {
  /* eslint-disable global-require */
  const methods = {
    [types.Array]: {
      len: require('../methods/Array/len'),
      slice: require('../methods/Array/slice'),
    },
    [types.Character]: {
      str: require('../methods/Character/str'),
    },
    [types.Float]: {
      str: require('../methods/Float/str'),
    },
    [types.String]: {
      char: require('../methods/String/char'),
      float: require('../methods/String/float'),
      len: require('../methods/String/len'),
      slice: require('../methods/String/slice'),
    },
  };
  /* eslint-enable global-require */

  return async (expr) => {
    if (expr.type !== 'method') return null;

    // Extra points if I make them plugins
    const parent = await evaluateExpression(expr.parent);
    let args;
    if (expr.arguments && expr.arguments.value && expr.arguments.value.length) {
      args = await evaluateExpression(expr.arguments);
    }

    const method = methods[parent.type] && methods[parent.type][expr.method];

    if (!method) {
      throw new Error(`Syntax Error: Method ${expr.method} is not recognized on type ${parent.type}.`);
    }

    return method({ evaluateExpression, types })(parent, args);
  };
};
