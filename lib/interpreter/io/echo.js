module.exports = ({ stdout }) => (arg) => {
  const message = arg;
  if (arg.type && arg.type === 'variable') {
    console.log('WHOOPS, look up variable in heap');
  }

  stdout.write(`${message}\n`);
};
