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

const keywords = require('./constants/keywords');
const operators = require('./constants/operators');
const types = require('./constants/types');
const debug = require('./debug');
const {
  keyword,
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
  gotoKeyword,
  ifKeyword,
  inputKeyword,
  letKeyword,
  pauseKeyword,
  procKeyword,
  structKeyword,
  remKeyword,
  returnKeyword,
  varKeyword,
  whileKeyword,
} = require('./parsers/keywords');
const {
  mapToType,
  mapToNull,
  mapToOperator,
  mapToBoolean,
  mapToCharacter,
  mapToString,
  mapToFloat,
  mapToArray,
  mapToVariableName,
  mapToFuncName,
  mapToProcName,
  mapToComment,
} = require('./parsers/mappers');
const {
  equalsOp,
  assignOperator,
  startGroupOp,
  endGroupOp,
  groupOperator,
  addOp,
  subtractOp,
  multiplyOp,
  divideOp,
  modOp,
  powerOp,
  arithmeticOperator,
  lessThanOp,
  greaterThanOp,
  equalToOp,
  notEqualToOp,
  booleanOperator,
  concatOp,
  stringOperator,
  accessOp,
} = require('./parsers/operators');
const {
  booleanValue,
  characterValue,
  floatValue,
  stringValue,
  primitive,
} = require('./parsers/primitives');
const {
  newLine,
  quote,
  singleQuote,
  space,
  funcOrProcName,
  funcName,
  procName,
  variableName,
  symbol,
} = require('./parsers/specialCharacters');
const {
  booleanStatement,
  characterStatement,
  stringStatement,
  floatStatement,
  arrayStatement,
  anyStatement,
  commentStatement,
} = require('./parsers/statements');
const {
  arithmeticExpression,
  arrayValue,
  booleanExpression,
  stringExpression,
  expression,
} = require('./parsers/expressions');
const beginLine = require('./parsers/lines/BEGIN');
const echoLine = require('./parsers/lines/ECHO');
const endWhileLine = require('./parsers/lines/ENDWHILE');
const exitLine = require('./parsers/lines/EXIT');
const letLine = require('./parsers/lines/LET');
const remLine = require('./parsers/lines/REM');
const varLine = require('./parsers/lines/VAR');
const whileLine = require('./parsers/lines/WHILE');

const endFuncLine = sequenceOf([
  endFuncKeyword,
])
  .map(([keyword]) => ({
    type: 'statement',
    keyword: keyword,
  }));
const endIfLine = sequenceOf([
  endIfKeyword,
])
  .map(([keyword]) => ({
    type: 'statement',
    keyword: keyword,
  }));
const endProcLine = sequenceOf([
  endProcKeyword,
])
  .map(([keyword]) => ({
    type: 'statement',
    keyword: keyword,
  }));
const callLine = sequenceOf([
  callKeyword,
  space,
  sequenceOf([procName]),
])
  .map(([keyword,, args]) => ({
    type: 'statement',
    keyword: keyword,
    name: args[0],
    arguments: args.slice(1),
  }));
const elseLine = sequenceOf([
  elseKeyword,
])
  .map(([keyword]) => ({
    type: 'statement',
    keyword: keyword,
  }));
const funcLine = sequenceOf([
  funcKeyword,
  space,
  funcName,
  possibly(space),
  possibly(sepBy(space)(variableName))
])
  .map(([keyword,, name,, parameters]) => ({
    type: 'statement',
    keyword: keyword,
    name: name,
    parameters,
  }));
const ifLine = sequenceOf([
  ifKeyword,
  space,
  booleanStatement,
])
  .map(([keyword,, condition]) => ({
    type: 'statement',
    keyword: keyword,
    condition,
  }));
const inputLine = sequenceOf([
  inputKeyword,
  space,
  variableName,
  space,
  stringStatement,
])
  .map(([keyword,, varName,, prompt]) => ({
    type: 'statement',
    keyword: keyword,
    variable: varName,
    prompt,
  }));
const pauseLine = sequenceOf([
  pauseKeyword,
  space,
  floatStatement,
])
  .map(([keyword,, arg]) => ({
    type: 'statement',
    keyword: keyword,
    arguments: [arg],
  }));
const procLine = sequenceOf([
  procKeyword,
  space,
  procName,
])
  .map(([keyword,, name]) => ({
    type: 'statement',
    keyword: keyword,
    name: name,
  }));
const returnLine = sequenceOf([
  returnKeyword,
  space,
  expression,
])
  .map(([keyword,, expr]) => {
    return {
      type: 'statement',
      keyword: keyword,
      expression: expr,
    };
  });

const noMemoryLine = choice([
  callLine,
  echoLine,
  inputLine,
  letLine,
  pauseLine,
  remLine,
]);

const simpleCodeLine = choice([
  noMemoryLine,
  varLine,
]);

// TODO: Handle ELSE
const ifBlock = sequenceOf([
  ifLine,
  sequenceOf([
    newLine,
    many1(
      sequenceOf([
        noMemoryLine,
        newLine,
      ]).map(([nml]) => nml),
    ),
  ]).map(([, line]) => line),
  endIfLine,
]).map(([w, block]) => ({
  ...w,
  block,
}));

const whileBlock = sequenceOf([
  whileLine,
  sequenceOf([
    newLine,
    many1(
      sequenceOf([
        choice([
          noMemoryLine,
          ifBlock,
        ]),
        newLine,
      ]).map(([stmt]) => stmt),
    ),
  ]).map(([, line]) => line),
  endWhileLine,
]).map(([w, block]) => ({
  ...w,
  block,
}));

const procBlock = sequenceOf([
  procLine,
  sequenceOf([
    newLine,
    many1(
      sequenceOf([
        choice([
          noMemoryLine,
          ifBlock,
          whileBlock,
        ]),
        newLine,
      ]).map(([stmt]) => stmt),
    ),
  ]).map(([, line]) => line),
  endProcLine,
]).map(([w, block]) => ({
  ...w,
  block,
}));

// Should functions be able to contain other functions?
// They're scoped so function names shouldn't collide with external function names.
const funcBlock = sequenceOf([
  funcLine,
  sequenceOf([
    newLine,
    many1(
      sequenceOf([
        choice([
          simpleCodeLine,
          ifBlock,
          whileBlock,
          returnLine,
        ]),
        newLine,
      ]).map(([stmt]) => stmt),
    ),
  ]).map(([, line]) => line),
  endFuncLine,
]).map(([w, block]) => ({
  ...w,
  block,
}));

const codeLine = recursiveParser(() => (choice([
  simpleCodeLine,
  ifBlock,
  whileBlock,
  procBlock,
  funcBlock,
])));

const blockParser = sequenceOf([
  // BEGIN
  sequenceOf([
    beginLine,
    possibly(many(newLine)),
  ])
    .map(([line]) => line),
  // Everything in between
  many(
    sequenceOf([
      codeLine,
      possibly(many(newLine)),
    ])
      .map(([line]) => line)
  ),
  // EXIT
  sequenceOf([
    exitLine,
    possibly(many(newLine)),
  ])
    .map(([line]) => line),
])
  .map(([beginLine, lines, exitLine]) => ([
    beginLine,
    ...lines,
    exitLine,
  ]))
  .map(statements => ({
    type: 'program',
    statements,
  }));

const Parser = blockParser;

module.exports = Parser;
