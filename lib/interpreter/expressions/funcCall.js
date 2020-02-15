const uuidv4 = require('uuid/v4');

module.exports = ({
  doBlock,
  evaluateExpression,
  memory,
  refs,
  stackTrace,
  structs,
}) => async (expr) => {
  if (expr.type !== 'funcCall') return null;

  // Create a function scope for the heap
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
      if (param.dataType.type === 'struct') {
        const dataType = {
          type: param.dataType.type,
          value: structs[param.dataType.value],
        };
        memory.malloc(newScope, param.value, dataType);
      } else {
        memory.malloc(newScope, param.value, param.dataType);
      }
      memory.massign(newScope, param.value, evaluatedArguments[paramIndex]);
    });
  // TODO: Add self reference to refs (for recursion)
  newRefs.push(funcRef);

  stackTrace.push(expr);
  const result = await doBlock(funcRef.block, {
    memScope: newScope,
    refs: newRefs,
  });
  stackTrace.pop();
  return result;
};
