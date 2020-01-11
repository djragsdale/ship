const keywords = require('./keywords');
const Parser = require('./Parser');

const lineIsStatement = (result) => result.type === 'statement';

const evaluate = async (script, {
  stdin = process.stdin,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) => {
  // Scopes create symbols which get their own memory heap
  const heap = {};
  const references = [];

  // TODO: Some sort of a malloc command generates a symbol for the variable name

  const echo = (arg) => {
    let message = arg;
    if (arg.type && arg.type === 'variable') {
      console.log('WHOOPS, look up variable in heap');
    }

    process.stdout.write(`${message}\n`);
  };

  const ast = Parser.run(script);

  if (ast.isError) {
    stdout.write(`SHIP ERROR at index ${ast.index}\n`);
    stdout.write(ast.error);
    throw new Error('SHIP error');
  }

  console.log(JSON.stringify(ast, null, 2));
  // console.log(JSON.stringify(ast.result.lines[11], null, 2));

  const evaluateExpression = () => {};

  // stdout.write('SHIP SUCCESS\n');
  // stdout.write('success');
  for (let i = 0; i < ast.result.lines.length; i++) {
    // TODO: Handle WHILE and ENDWHILE
    // The following statements should nest other statements inside them
    // - WHILE
    // - FUNC
    // - PROC
    // - IF
    // - ELSE
    const line = ast.result.lines[i];

    if (lineIsStatement(line)) {
      if (line.keyword === keywords.VAR) {
        if (heap[line.variable.value]) {
          throw new Error(`Reference Error: Variable ${line.variable.value} already exists.`);
        }

        heap[line.variable.value] = null;
      }

      // if (line.keyword === keywords.LET) {
      //   if (typeof heap[line.variable.value] === 'undefined') {
      //     throw new Error(`Reference Error: Variable ${line.variable.value} does not exist.`);
      //   }

      //   console.log('LET expression', line.expression);
      //   // heap[line.variable.value] = evaluateExpression(line.expression);;
      // }

      // if (line.keyword === keywords.PROC) {
      //   if (references.find(ref => ref.name === line.name)) {
      //     throw new Error(`Reference Error: Procedure ${line.name} already exists.`);
      //   }

      //   references.push({
      //     type: 'procedure',
      //     name: line.name,
      //   });
      // }

      // if (line.keyword === keywords.FUNC) {
      //   if (references.find(ref => ref.name === line.name)) {
      //     throw new Error(`Reference Error: Function ${line.name} already exists.`);
      //   }

      //   references.push({
      //     type: 'function',
      //     name: line.name,
      //     parameters: line.parameters.map(p => p.value),
      //   });
      // }

      // if (line.keyword === keywords.CALL) {
      //   if (!references.find(ref => ref.name === line.name)) {
      //     throw new Error(`Reference Error: Procedure ${line.name} does not exist.`);
      //   }

      //   // references.push({
      //   //   type: 'procedure',
      //   //   name: line.name,
      //   // });
      //   console.log('CALL', line.name);
      // }

      if (line.keyword === keywords.ECHO) {
        echo(line.arguments[0].value);
      }
    }
  }

  console.log('memory', heap);
  console.log('references', references);
};

module.exports = evaluate;
