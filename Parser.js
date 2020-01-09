const {
  anythingExcept,
  everythingUntil,
  between,
  char,
  choice,
  letters,
  many,
  parse,
  possibly,
  sequenceOf,
  str,
} = require('arcsecond');

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

const __columnKeyword = str('__COLUMN');
const __lineKeyword = str('__LINE');
const beginKeyword = str('BEGIN');
const echoKeyword = str('ECHO');
const elseKeyword = str('ELSE');
const endIfKeyword = str('ENDIF');
const endWhileKeyword = str('ENDWHILE');
const exitKeyword = str('EXIT');
const funcKeyword = str('FUNC');
const gotoKeyword = str('GOTO');
const ifKeyword = str('IF');
const inputKeyword = str('INPUT');
const letKeyword = str('LET');
const pauseKeyword = str('PAUSE');
const procKeyword = str('PROC');
const structKeyword = str('STRUCT');
const remKeyword = str('REM');
const varKeyword = str('VAR');
const whileKeyword = str('WHILE');

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
  gotoKeyword,
  ifKeyword,
  inputKeyword,
  letKeyword,
  pauseKeyword,
  procKeyword,
  structKeyword,
  remKeyword,
  varKeyword,
  whileKeyword,
]);

const quote = char('"');
const newLine = char('\n');
const space = char(' ');
const variableName = sequenceOf([
  char('$'),
  letters,
]);
const quotedString = between(quote)(quote)(
  // TODO: Handle escaped quotes
  many(anythingExcept(quote)).map(s => s.join('')), // concat string
);

const beginLine = sequenceOf([
  keyword,
  space,
  choice([
    letters,
    quotedString,
  ]),
])

// const moreStuff = many(anythingExcept(char('\n')));
const moreStuff = everythingUntil(newLine);

const placeholder = sequenceOf([
  keyword,
  space,
  moreStuff,
]);

const codeLine = choice([
  // placeholder,
  beginLine,
]);

const script = sequenceOf([
  codeLine,
  possibly(newLine),
])

const Parser = script;

const output = Parser.run(code);

console.log(output);
