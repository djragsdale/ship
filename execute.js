
const fs = require('fs');
const { promisify } = require('util');

const evaluate = require('./evaluate');

const readFile = promisify(fs.readFile);

const execute = async (absoluteFilePath) => {
  const script = await readFile(absoluteFilePath, 'utf-8');
  await evaluate(script);
};

module.exports = execute;
