module.exports = (name) => {
  throw new Error(`Reference Error: Function ${name} already exists.`);
};
