const Parser = require('./Parser');

// TODO: Replace GOTO code with PROC code
const code = `BEGIN "LOOP-TEST"
REM Declare all variables
VAR $VAR1
ECHO "LOOP TEST BEGINNING..."
LET $VAR1 = 0
ECHO "ECHOING HELLO WORLD #1 TIMES"
WHILE ($VAR1 < 1)
ECHO "HELLO, WORLD!"
LET $VAR1 = ($VAR1 + 1)
ENDWHILE
ECHO "DONE LOOPING."
ECHO "SUCCESS!"
EXIT "LOOP-TEST"`;

const evaluate = async (script, {
  stdin = process.stdin,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) => {
  const ast = Parser.run(script);

  console.log(JSON.stringify(ast, null, 2));
};

module.exports = evaluate;
