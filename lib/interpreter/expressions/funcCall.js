module.exports = ({
  doBlock,
  evaluateExpression,
  refs,
  stackTrace,
}) => async (expr) => {
  if (expr.type !== 'funcCall') return null;

  const newHeap = {};
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
      newHeap[param] = evaluatedArguments[paramIndex];
    });
  // Add self reference to refs (for recursion)
  newRefs.push(funcRef);

  stackTrace.push(expr);
  const result = await doBlock(funcRef.block, {
    mem: newHeap,
    refs: newRefs,
  });
  stackTrace.pop();
  return result;
};
