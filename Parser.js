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
  parse,
  possibly,
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
IF $VAR1 < #1
GOTO 9
GOTO 12
ECHO "HELLO, WORLD!"
LET $VAR1 = $VAR1 + 1
GOTO 6
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
  'ECHO': 'ECHO',
  'ELSE': 'ELSE',
  'ENDIF': 'ENDIF',
  'ENDWHILE': 'ENDWHILE',
  'EXIT': 'EXIT',
  'FUNC': 'FUNC',
  'IF': 'IF',
  'INPUT': 'INPUT',
  'LET': 'LET',
  'PAUSE': 'PAUSE',
  'PROC': 'PROC',
  'REM': 'REM',
  'VAR': 'VAR',
  'WHILE': 'WHILE',
};

const __columnKeyword = str(keywords.__COLUMN).map(mapToKeyword);
const __lineKeyword = str(keywords.__LINE).map(mapToKeyword);
const beginKeyword = str(keywords.BEGIN).map(mapToKeyword);
const echoKeyword = str(keywords.ECHO).map(mapToKeyword);
const elseKeyword = str(keywords.ELSE).map(mapToKeyword);
const endIfKeyword = str(keywords.ENDIF).map(mapToKeyword);
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
const varKeyword = str(keywords.VAR).map(mapToKeyword);
const whileKeyword = str(keywords.WHILE).map(mapToKeyword);

const keyword = choice([
  __columnKeyword,
  __lineKeyword,
  beginKeyword,
  echoKeyword,
  elseKeyword,
  endIfKeyword,
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
  varKeyword,
  whileKeyword,
]);

// Operators


// Special characters
const equal = char('=');
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

// Statements:
// - Boolean
// - Character
// - String
// - Float
// - Array
const booleanStatement = choice([
  booleanValue,
  variableName,
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
  floatValue,
  variableName,
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
]);
const echoLine = sequenceOf([
  echoKeyword,
  space,
  stringStatement,
]);
const elseLine = sequenceOf([
  elseKeyword,
]);
const endIfLine = sequenceOf([
  endIfKeyword,
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
]);
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
  equal,
  space,
  anyStatement,
]);
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
]);
const varLine = sequenceOf([
  varKeyword,
  space,
  variableName,
]);
const whileLine = sequenceOf([
  whileKeyword,
  space,
  booleanStatement,
]);

const codeLine = choice([
  beginLine,
  echoLine,
  elseLine,
  endIfLine,
  endWhileLine,
  exitLine,
  funcLine,
  ifLine,
  inputLine,
  letLine,
  pauseLine,
  procLine,
  remLine,
  varLine,
  whileLine,
]);

const script = many(sequenceOf([
  codeLine,
  possibly(newLine),
]));

const Parser = script;

const ast = Parser.run(code);

console.log(JSON.stringify(ast, null, 2));
