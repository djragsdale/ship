const {
  anythingExcept,
  everythingUntil,
  between,
  char,
  choice,
  digit,
  digits,
  letter,
  letters,
  many,
  many1,
  possibly,
  recursiveParser,
  sepBy,
  sequenceOf,
  str,
} = require('arcsecond');

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

// - Boolean
// - Character
// - String
// - Float
// - Array
const mapToType = (type) => (value) => ({
  type,
  value,
});
const mapToNull = mapToType('null');
const mapToKeyword = mapToType('keyword');
const mapToOperator = mapToType('operator');
const mapToBoolean = mapToType('boolean');
const mapToCharacter = mapToType('character');
const mapToString = mapToType('string');
const mapToFloat = mapToType('float');
const mapToArray = mapToType('array');
const mapToVariableName = mapToType('variable');
const mapToFuncName = mapToType('func');
const mapToProcName = mapToType('proc');
const mapToComment = mapToType('comment');

const keywords = {
  '__COLUMN': '__COLUMN',
  '__LINE': '__LINE',
  'BEGIN': 'BEGIN',
  'CALL': 'CALL',
  'ECHO': 'ECHO',
  'ELSE': 'ELSE',
  'ENDFUNC': 'ENDFUNC',
  'ENDIF': 'ENDIF',
  'ENDPROC': 'ENDPROC',
  'ENDWHILE': 'ENDWHILE',
  'EXIT': 'EXIT',
  'FUNC': 'FUNC',
  'IF': 'IF',
  'INPUT': 'INPUT',
  'LET': 'LET',
  'PAUSE': 'PAUSE',
  'PROC': 'PROC',
  'REM': 'REM',
  'RETURN': 'RETURN',
  'VAR': 'VAR',
  'WHILE': 'WHILE',
};

const __columnKeyword = str(keywords.__COLUMN).map(mapToKeyword);
const __lineKeyword = str(keywords.__LINE).map(mapToKeyword);
const beginKeyword = str(keywords.BEGIN).map(mapToKeyword);
const callKeyword = str(keywords.CALL).map(mapToKeyword);
const echoKeyword = str(keywords.ECHO).map(mapToKeyword);
const elseKeyword = str(keywords.ELSE).map(mapToKeyword);
const endFuncKeyword = str(keywords.ENDFUNC).map(mapToKeyword);
const endIfKeyword = str(keywords.ENDIF).map(mapToKeyword);
const endProcKeyword = str(keywords.ENDPROC).map(mapToKeyword);
const endWhileKeyword = str(keywords.ENDWHILE).map(mapToKeyword);
const exitKeyword = str(keywords.EXIT).map(mapToKeyword);
const funcKeyword = str(keywords.FUNC).map(mapToKeyword);
// const gotoKeyword = str('GOTO');
const ifKeyword = str(keywords.IF).map(mapToKeyword);
const inputKeyword = str(keywords.INPUT).map(mapToKeyword);
const letKeyword = str(keywords.LET).map(mapToKeyword);
const pauseKeyword = str(keywords.PAUSE).map(mapToKeyword);
const procKeyword = str(keywords.PROC).map(mapToKeyword);
// const structKeyword = str('STRUCT');
const remKeyword = str(keywords.REM).map(mapToKeyword);
const returnKeyword = str(keywords.RETURN).map(mapToKeyword);
const varKeyword = str(keywords.VAR).map(mapToKeyword);
const whileKeyword = str(keywords.WHILE).map(mapToKeyword);

const keyword = choice([
  __columnKeyword,
  __lineKeyword,
  beginKeyword,
  callKeyword,
  echoKeyword,
  elseKeyword,
  endFuncKeyword,
  endIfKeyword,
  endProcKeyword,
  endWhileKeyword,
  exitKeyword,
  funcKeyword,
  // gotoKeyword,
  ifKeyword,
  inputKeyword,
  letKeyword,
  pauseKeyword,
  procKeyword,
  // structKeyword,
  remKeyword,
  returnKeyword,
  varKeyword,
  whileKeyword,
]);

// Operators
// - Assignment
const equalsOp = char('=').map(mapToOperator);
const assignOperator = choice([
  equalsOp,
]);
// - Grouping
const startGroupOp = char('(').map(mapToOperator);
const endGroupOp = char(')').map(mapToOperator);
const groupOperator = choice([
  startGroupOp,
  endGroupOp,
]);
// - Arithmetic
const addOp = char('+').map(mapToOperator);
const subtractOp = char('-').map(mapToOperator);
const multiplyOp = char('*').map(mapToOperator);
const divideOp = char('-').map(mapToOperator);
const modOp = char('%').map(mapToOperator);
const powerOp = char('^').map(mapToOperator);
const arithmeticOperator = choice([
  addOp,
  subtractOp,
  multiplyOp,
  divideOp,
  modOp,
  powerOp,
]);
// - Boolean
const lessThanOp = char('<').map(mapToOperator);
const greaterThanOp = char('>').map(mapToOperator);
const equalToOp = str('==').map(mapToOperator);
const notEqualToOp = str('!=').map(mapToOperator);
const booleanOperator = choice([
  lessThanOp,
  greaterThanOp,
  equalToOp,
  notEqualToOp,
]);

// Special characters
const newLine = char('\n').map(mapToNull);
const quote = char('"');
const singleQuote = char('\'');
const space = char(' ').map(mapToNull);
// TODO: Make sure name isn't in keywords or just a number
const funcOrProcName = many1(choice(
  letters,
  digits,
));
const funcName = funcOrProcName.map(mapToFuncName);
const procName = funcOrProcName.map(mapToProcName);
const variableName = sequenceOf([
  char('$'),
  letters,
  digits,
]).map(x => x.join('')).map(mapToVariableName);
const symbol = choice([
  char('!'),
  char('@'),
  char('#'),
  char('$'),
  char('%'),
  char('^'),
  char('&'),
  char('*'),
  char('('),
  char(')'),
  char(','),
  char('.'),
  char('?'),
  char('/'),
  char(';'),
  char(':'),
  char('-'),
  char('='),
  char('_'),
  char('+'),
  char('|'),
])

// Primitives:
const booleanValue = choice([
  str('True'),
  str('False'),
]).map(mapToBoolean);
const characterValue = between(singleQuote)(singleQuote)(choice(letter, digit, symbol)).map(mapToCharacter);
const floatValue = sequenceOf([
  many1(digits),
  possibly(char('.')),
  possibly(many1(digits)),
]).map(mapToFloat);
const stringValue = between(quote)(quote)(
  // TODO: Handle escaped quotes
  many(anythingExcept(quote)).map(s => s.join('')), // concat string
).map(mapToString);

const primitive = choice([
  booleanValue,
  characterValue,
  floatValue,
  stringValue,
]);

const arrayValue = between(char('['))(char(']'))(sepBy(char(','), choice([
  variableName,
  primitive,
]))).map(mapToArray);

const expression = recursiveParser(() => (
  choice([
    between(startGroupOp)(endGroupOp)(sequenceOf([
      choice([
        expression,
        primitive,
        variableName,
      ]),
      space,
      choice([
        arithmeticOperator,
        booleanOperator,
      ]),
      space,
      choice([
        expression,
        primitive,
        variableName,
      ]),
    ])).map(([left,, op,, right]) => [left, op, right]),
    variableName,
  ])
));

// Should I call these expressions instead of statements?
// Statements:
// - Boolean
// - Character
// - String
// - Float
// - Array
const booleanStatement = choice([
  expression,
  booleanValue,
  // TODO: Determine valid boolean statement
]);
const characterStatement = choice([
  characterValue,
  variableName,
]);
const stringStatement = choice([
  stringValue,
  variableName, // TODO: Check that variable is type string
]);
const floatStatement = choice([
  expression,
  variableName,
  floatValue,
]);
const arrayStatement = arrayValue;
const anyStatement = choice([
  booleanStatement,
  characterStatement,
  stringStatement,
  floatStatement,
  arrayStatement,
]);
const commentStatement = everythingUntil(newLine).map(mapToComment);

const beginLine = sequenceOf([
  beginKeyword,
  space,
  choice([
    letters,
    stringValue,
  ]),
]).map(([keyword,, name]) => [keyword, name]);
const callLine = sequenceOf([
  callKeyword,
  space,
  choice([
    procName,
    sequenceOf([
      funcName,
      space,
      sepBy(space, anyStatement),
    ]),
  ]),
]);
const echoLine = sequenceOf([
  echoKeyword,
  space,
  stringStatement,
]).map(([keyword,, statement]) => [keyword, statement]);
const elseLine = sequenceOf([
  elseKeyword,
]);
const endFuncLine = sequenceOf([
  endFuncKeyword,
]);
const endIfLine = sequenceOf([
  endIfKeyword,
]);
const endProcLine = sequenceOf([
  endProcKeyword,
]);
const endWhileLine = sequenceOf([
  endWhileKeyword,
]);
const exitLine = sequenceOf([
  exitKeyword,
  possibly(everythingUntil(newLine)),
]);
const funcLine = sequenceOf([
  funcKeyword,
  space,
  funcName,
]);
const ifLine = sequenceOf([
  ifKeyword,
  space,
  booleanStatement,
]).map(([keyword,, statement]) => [keyword, statement]);
const inputLine = sequenceOf([
  inputKeyword,
  space,
  variableName,
  space,
  stringStatement,
]);
const letLine = sequenceOf([
  letKeyword,
  space,
  variableName,
  space,
  equalsOp,
  space,
  anyStatement,
]).map(([keyword,, varName,, op,, statement]) => [keyword, varName, op, statement]);
const pauseLine = sequenceOf([
  pauseKeyword,
  space,
  floatStatement,
]);
const procLine = sequenceOf([
  procKeyword,
  space,
  procName,
]);
const remLine = sequenceOf([
  remKeyword,
  space,
  commentStatement,
]).map(([keyword,, statement]) => [keyword, statement]);
const returnLine = sequenceOf([
  returnKeyword,
  space,
  anyStatement,
])
const varLine = sequenceOf([
  varKeyword,
  space,
  variableName,
]).map(([keyword,, statement]) => [keyword, statement]);
const whileLine = sequenceOf([
  whileKeyword,
  space,
  booleanStatement,
]);

const codeLine = choice([
  beginLine,
  callLine,
  echoLine,
  elseLine,
  endFuncLine,
  endIfLine,
  endProcLine,
  endWhileLine,
  exitLine,
  funcLine,
  ifLine,
  inputLine,
  letLine,
  pauseLine,
  procLine,
  remLine,
  returnLine,
  varLine,
  whileLine,
]);

const script = many(sequenceOf([
  codeLine,
  possibly(newLine),
]).map(([line]) => [line]));

const Parser = script;

const ast = Parser.run(code);

console.log(JSON.stringify(ast, null, 2));
