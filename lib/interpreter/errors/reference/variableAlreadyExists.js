module.exports = (name) => {
  throw new Error(`Reference Error: Variable ${name} already exists.`);
};
