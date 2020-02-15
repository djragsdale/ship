module.exports = (scope, name, failType) => {
  throw new Error(`Type Error: Cannot assign value of type ${failType} to variable ${name} in scope ${scope}.`);
};
