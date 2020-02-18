const errors = require('./errors');
const types = require('../constants/types');

// const createStruct = require('./createStruct');

const evaluateExpressionFactory = ({
  doBlock,
  memScope,
  memory,
  refs,
  stackTrace,
  structs,
}) => {
  const evaluateExpression = async (expr) => {
    /* eslint-disable global-require */
    const expressionFactories = [
      // The order shouldn't be logically important
      // It should be ordered for optimization
      // Smallest and/or most common should be at the top
      require('./expressions/boolean'),
      require('./expressions/float'),
      require('./expressions/string'),
      require('./expressions/array'),
      require('./expressions/character'),
      require('./expressions/struct'),
      require('./expressions/variable'),
      require('./expressions/expression'),
      require('./expressions/funcCall'),
      require('./expressions/method'),
      require('./expressions/prop'),
    ];
    /* eslint-enable global-require */

    const evaluatedExpression = await (expressionFactories
      .map((factory) => factory({
        doBlock,
        evaluateExpression,
        memScope,
        memory,
        refs,
        stackTrace,
        structs,
        types, // Add this in to save on imports
      }))
      .reduce(async (chain, current) => {
        const result = await chain;
        return result || current(expr);
      }, Promise.resolve()));

    if (!evaluatedExpression) {
      errors.syntax.expressionNotRecognized(expr.type);
    }

    return evaluatedExpression;
  };

  return evaluateExpression;
};

module.exports = evaluateExpressionFactory;
