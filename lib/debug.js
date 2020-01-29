const debug = (msg) => (arg) => {
  console.log(msg, arg);
  return arg;
};

module.exports = debug;
