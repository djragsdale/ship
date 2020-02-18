module.exports = (method, baseType) => {
  throw new Error(`Syntax Error: Method ${method} is not recognized on type ${baseType}.`);
};
