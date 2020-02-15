module.exports = (name) => {
  throw new Error(`Reference Error: Struct ${name} already exists.`);
};
