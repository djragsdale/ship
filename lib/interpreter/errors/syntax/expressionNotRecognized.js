module.exports = (exprType) => {
  throw new Error(`Syntax Error: Can't evaluate expression of type ${exprType}.`);
};
