module.exports = (scope, name) => {
  throw new Error(`Reference Error: Variable ${name} does not exist for scope ${scope}.`);
};
