module.exports = ({
  evaluateExpression,
  types,
}) => async (expr) => {
  if (expr.type !== 'method') return null;

  // TODO: Extract these methods to separate files of pure functions
  // Extra points if I make them plugins
  const parent = await evaluateExpression(expr.parent);

  // Array built-ins
  if (parent.type === types.Array) {
    if (expr.method === 'len') {
      return evaluateExpression({
        type: types.Float,
        value: [`${parent.value.length}`, null, null],
      });
    }

    if (expr.method === 'slice') {
      const args = await evaluateExpression(expr.arguments);

      const [startIdx, endIdx] = args.value.map((a) => a.value);

      return evaluateExpression({
        type: types.String,
        value: parent.value.slice(startIdx, endIdx),
      });
    }
  }

  // Character built-ins
  if (parent.type === types.Character) {
    if (expr.method === 'str') {
      return evaluateExpression({
        type: types.String,
        value: parent.value,
      });
    }
  }

  // Float built-ins
  // ceil
  // floor

  // String built-ins
  if (parent.type === types.String) {
    if (expr.method === 'char') {
      const args = await evaluateExpression(expr.arguments);

      const [startIdx] = args.value.map((a) => a.value);

      return evaluateExpression({
        type: types.Character,
        value: parent.value.substring(startIdx, startIdx + 1),
      });
    }

    if (expr.method === 'len') {
      return evaluateExpression({
        type: types.Float,
        value: [`${parent.value.length}`, null, null],
      });
    }

    if (expr.method === 'slice') {
      const args = await evaluateExpression(expr.arguments);

      const [startIdx, endIdx] = args.value.map((a) => a.value);

      return evaluateExpression({
        type: types.String,
        value: parent.value.substring(startIdx, endIdx),
      });
    }
  }

  throw new Error(`Syntax Error: Method ${expr.method} is not recognized on type ${parent.type}.`);
};
