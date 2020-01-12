
const fs = require('fs');
const { promisify } = require('util');

const interpret = require('./interpret');

const readFile = promisify(fs.readFile);

const execute = async (absoluteFilePath, {
  stdin = process.stdin,
  stdout = process.stdout,
  stderr = process.stderr,
}) => {
  const script = await readFile(absoluteFilePath, 'utf-8');
  await interpret(script, {
    stdin,
    stdout,
    stderr,
  });
};

module.exports = execute;
