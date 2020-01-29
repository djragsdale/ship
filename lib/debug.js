const debug = (msg) => (arg) => {
  console.log(msg, arg); // eslint-disable-line no-console
  return arg;
};

module.exports = debug;
