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
  arithmeticExpression,
  booleanExpression,
  stringExpression,
  expression,
} = require('./parsers/expressions');

const arrayValue = between(char('['))(char(']'))(sepBy(str(', '))(choice([
  variableName,
  primitive,
  expression,
]))).map(mapToArray);

// Built-in methods
// Methods categorized by return values
let methodReturningArray;
let methodReturningBoolean;
let methodReturningCharacter;
let methodReturningFloat;
let methodReturningString;
const arrayLenMethod = sequenceOf([
  choice([
    variableName,
    arrayValue,
    // arrayMethod,
  ]),
  accessOp,
  str('len'),
])
  .map(([parent, op, method]) => ({
    type: 'method',
    returnType: types.Float,
    parent,
    method,
    arguments: [],
    operator: op,
  }));
const arraySliceMethod = sequenceOf([
  choice([
    variableName,
    arrayValue,
    // arrayMethod,
  ]),
  accessOp,
  str('slice'),
  space,
  arrayValue,
])
  .map(([parent, op, method,, args]) => ({
    type: 'method',
    returnType: types.Array,
    parent,
    method,
    arguments: args,
    operator: op,
  }));
const charToStringMethod = sequenceOf([
  choice([
    characterValue,
    variableName,
    // characterMethod,
  ]),
  accessOp,
  str('str'),
])
  .map(([parent, op, method]) => ({
    type: 'method',
    returnType: types.String,
    parent,
    method,
    arguments: [],
    operator: op,
  }));
const stringLenMethod = sequenceOf([
  choice([
    variableName,
    stringExpression,
    stringValue,
    // stringMethod,
  ]),
  accessOp,
  str('len'),
])
  .map(([parent, op, method]) => ({
    type: 'method',
    returnType: types.Float,
    parent,
    method,
    arguments: [],
    operator: op,
  }));
const stringCharMethod = sequenceOf([
  choice([
    variableName,
    stringExpression,
    stringValue,
    // stringMethod,
  ]),
  accessOp,
  str('char'),
  space,
  arrayValue,
])
  .map(([parent, op, method,, args]) => ({
    type: 'method',
    returnType: types.Character,
    parent,
    method,
    arguments: args,
    operator: op,
  }));
const stringSliceMethod = sequenceOf([
  choice([
    variableName.map(debug('checking variable name')),
    stringExpression.map(debug('checking string expression')),
    stringValue.map(debug('checking string value')),
    // stringMethod,
  ]).map(debug('string expr')),
  accessOp.map(debug('access op')),
  str('slice'),
  space,
  arrayValue.map(debug('slice array')).map(debug('matched string slice')),
])
  .map(([parent, op, method,, args]) => ({
    type: 'method',
    returnType: types.String,
    parent,
    method,
    arguments: args,
    operator: op,
  }));

// Methods categorized by return values
methodReturningArray = choice([
  arrayLenMethod,
  arraySliceMethod,
]);

methodReturningBoolean = choice([
  // TODO: string to boolean "TRUE" or "FALSE"
  // TODO: float to boolean "1" or "0", only check first part of float
]);

methodReturningCharacter = choice([
  stringCharMethod,
]);

methodReturningFloat = choice([
  arrayLenMethod,
  stringLenMethod,
]);

methodReturningString = choice([
  charToStringMethod,
  stringSliceMethod,
]);


const booleanStatement = choice([
  // Methods parsed first
  // methodReturningBoolean,
  booleanExpression,
  booleanValue,
  // TODO: Determine valid boolean statement
]);
const characterStatement = choice([
  // Methods parsed first
  methodReturningCharacter,
  characterValue,
  variableName,
]);
const stringStatement = choice([
  // Methods parsed first
  methodReturningString,
  stringValue,
  variableName, // TODO: Check that variable is type string
]);
const floatStatement = choice([
  // Methods parsed first
  methodReturningFloat,
  arithmeticExpression,
  variableName,
  floatValue,
]);
const arrayStatement = choice([
  // Methods parsed first
  methodReturningArray,
  arrayValue,
  variableName,
]);
const anyStatement = choice([
  booleanStatement,
  characterStatement,
  stringStatement,
  floatStatement,
  arrayStatement,
]);
const commentStatement = everythingUntil(newLine).map(mapToComment);

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
const endWhileLine = sequenceOf([
  endWhileKeyword,
])
  .map(([keyword]) => ({
    type: 'statement',
    keyword: keyword,
  }));

const beginLine = sequenceOf([
  beginKeyword,
  space,
  stringStatement
])
  .map(([keyword,, program]) => ({
    type: 'statement',
    keyword: keyword,
    program: program && program.value,
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
const echoLine = sequenceOf([
  echoKeyword,
  space,
  choice([
    stringStatement,
    stringExpression,
  ]),
])
  .map(([keyword,, statement]) => ({
    type: 'statement',
    keyword: keyword,
    arguments: [statement],
  }));
const elseLine = sequenceOf([
  elseKeyword,
])
  .map(([keyword]) => ({
    type: 'statement',
    keyword: keyword,
  }));
const exitLine = sequenceOf([
  exitKeyword,
  possibly(space),
  possibly(stringStatement),
])
  .map(([keyword,, program]) => ({
    type: 'statement',
    keyword: keyword,
    program: program && program.value,
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
const letLine = sequenceOf([
  letKeyword,
  space,
  variableName.map(debug('LET line')), // TODO: Allow assignment to struct properties
  space,
  assignOperator,
  space,
  choice([
    str('$segment->len')
      // .map(debug('test line 2'))
      .map(() => ({
        type: types.Float,
        value: ['3', null, null],
      })),
    // expression, // Swapped expression for anyStatement
    anyStatement,
    primitive,
    sequenceOf([
      funcName,
      space,
      choice([
        arrayValue,
        variableName, // Can pass a variable of an array
      ]),
    ]).map(([name,, args]) => ({
      type: 'funcCall',
      name,
      arguments: args,
    })),
  ]),
])
  .map(([keyword,, varName,, op,, expr]) => ({
    type: 'statement',
    keyword: keyword,
    variable: varName,
    operator: op,
    expression: expr,
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
const remLine = sequenceOf([
  remKeyword,
  space,
  commentStatement,
])
  .map(([keyword,, statement]) => ({
    type: 'statement',
    keyword: keyword,
    statement,
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
const varLine = sequenceOf([
  varKeyword,
  space,
  variableName,
])
  .map(([keyword,, varName]) => ({
    type: 'statement',
    keyword: keyword,
    variable: varName,
  }));
const whileLine = sequenceOf([
  whileKeyword,
  space,
  booleanStatement,
])
  .map(([keyword,, condition]) => ({
    type: 'statement',
    keyword: keyword,
    condition,
  }));

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
