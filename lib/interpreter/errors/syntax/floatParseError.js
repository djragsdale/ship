module.exports = (value) => {
  throw new Error(`Syntax Error: Unable to parse float ${value}.`);
}