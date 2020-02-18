module.exports = (structName, parent, prop) => {
  throw new Error(`Reference Error: Struct "${structName}" for variable "${parent}" does not have prop "${prop}".`);
};
