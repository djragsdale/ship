const keywords = require('./keywords');
const Parser = require('./Parser');

const lineIsStatement = (result) => result.type === 'statement';

const evaluate = async (script, {
  stdin = process.stdin,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) => {
  const heap = {};

  const echo = (arg) => {
    let message = arg;
    if (arg.type && arg.type === 'variable') {
      console.log('WHOOPS, look up variable in heap');
    }

    process.stdout.write(`${message}\n`);
  };

  const ast = Parser.run(script);

  if (ast.isError) {
    stdout.write('SHIP ERROR\n');
    stdout.write()
    throw new Error('SHIP error');
  }

  console.log(JSON.stringify(ast, null, 2));

  // stdout.write('SHIP SUCCESS\n');
  // stdout.write('success');
  for (let line of ast.result.lines) {
    // TODO: Handle WHILE and ENDWHILE
    // The following statements should nest other statements inside them
    // - WHILE
    // - FUNC
    // - PROC
    if (lineIsStatement(line) && line.keyword === keywords.ECHO) {
      echo(line.arguments[0].value);
    }
  }
};

module.exports = evaluate;
