module.exports = (name) => {
  throw new Error(`Reference Error: Procedure ${name} does not exist.`);
};
