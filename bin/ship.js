#!/usr/bin/env node

const path = require('path');
const { execute } = require('../index.js');

const main = async () => {
  const pathArg = process.argv[2];
  const resolvedPath = path.resolve(pathArg);

  await execute(resolvedPath);
};

main();
