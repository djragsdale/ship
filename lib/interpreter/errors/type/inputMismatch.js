module.exports = (scope, name) => {
  throw new Error(`Type Error: Variable ${name} in scope ${scope} must be type string to accept input.`);
};
