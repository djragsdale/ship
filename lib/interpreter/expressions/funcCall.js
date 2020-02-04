const uuidv4 = require('uuid/v4');

module.exports = ({
  doBlock,
  evaluateExpression,
  memory,
  refs,
  stackTrace,
}) => async (expr) => {
  if (expr.type !== 'funcCall') return null;

  // Instead of passing the heap, pass a heap scope
  const newScope = uuidv4();
  const newRefs = [];
  // Declare parameter variables on heap
  const funcRef = refs
    .find((ref) => ref.name === expr.name);

  const evaluatedArguments = await Promise.all(
    expr.arguments.value.map((val) => evaluateExpression(val)),
  );

  funcRef
    .parameters
    .forEach((param, paramIndex) => {
      memory.malloc(newScope, param);
      memory.massign(newScope, param, evaluatedArguments[paramIndex]);
    });
  // Add self reference to refs (for recursion)
  newRefs.push(funcRef);

  stackTrace.push(expr);
  const result = await doBlock(funcRef.block, {
    memScope: newScope,
    refs: newRefs,
  });
  stackTrace.pop();
  return result;
};
