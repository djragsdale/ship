module.exports = (name) => {
  throw new Error(`Reference Error: Procedure ${name} already exists.`);
};
