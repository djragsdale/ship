module.exports = (name) => {
  throw new Error(`Reference Error: Function ${name} does not exist.`);
};
