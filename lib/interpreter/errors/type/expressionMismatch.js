module.exports = (type1, operator, type2) => {
  throw new Error(`Type Error: Cannot evaluate expression of type ${type1} and type ${type2} with operator ${operator}.`);
};
