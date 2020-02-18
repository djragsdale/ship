module.exports = (parent, prop) => {
  throw new Error(`Reference Error: Cannot evaluate property "${prop}" of undefined "${parent}".`);
};
