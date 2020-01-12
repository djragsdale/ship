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

const debug = (msg) => (arg) => {
  console.log(msg, arg);
  return arg;
}
;
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
const mapToOperator = mapToType('operator');
const mapToBoolean = mapToType(types.Boolean);
const mapToCharacter = mapToType(types.Character);
const mapToString = mapToType(types.String);
const mapToFloat = mapToType(types.Float);
const mapToArray = mapToType(types.Array);
const mapToVariableName = mapToType('variable');
const mapToFuncName = ([value]) => value;
const mapToProcName = ([value]) => value;
const mapToComment = mapToType('comment');

const __columnKeyword = str(keywords.__COLUMN);
const __lineKeyword = str(keywords.__LINE);
const beginKeyword = str(keywords.BEGIN);
const callKeyword = str(keywords.CALL);
const echoKeyword = str(keywords.ECHO);
const elseKeyword = str(keywords.ELSE);
const endFuncKeyword = str(keywords.ENDFUNC);
const endIfKeyword = str(keywords.ENDIF);
const endProcKeyword = str(keywords.ENDPROC);
const endWhileKeyword = str(keywords.ENDWHILE);
const exitKeyword = str(keywords.EXIT);
const funcKeyword = str(keywords.FUNC);
// const gotoKeyword = str('GOTO');
const ifKeyword = str(keywords.IF);
const inputKeyword = str(keywords.INPUT);
const letKeyword = str(keywords.LET);
const pauseKeyword = str(keywords.PAUSE);
const procKeyword = str(keywords.PROC);
// const structKeyword = str('STRUCT');
const remKeyword = str(keywords.REM);
const returnKeyword = str(keywords.RETURN);
const varKeyword = str(keywords.VAR);
const whileKeyword = str(keywords.WHILE);

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
const addOp = char(operators.ADD).map(mapToOperator);
const subtractOp = char(operators.SUBTRACT).map(mapToOperator);
const multiplyOp = char(operators.MULTIPLY).map(mapToOperator);
const divideOp = char(operators.DIVIDE).map(mapToOperator);
const modOp = char(operators.MOD).map(mapToOperator);
const powerOp = char(operators.POWER).map(mapToOperator);
const arithmeticOperator = choice([
  addOp,
  subtractOp,
  multiplyOp,
  divideOp,
  modOp,
  powerOp,
]);
// - Boolean
const lessThanOp = char(operators.LESS_THAN).map(mapToOperator);
const greaterThanOp = char(operators.GREATER_THAN).map(mapToOperator);
const equalToOp = str(operators.EQUAL_TO).map(mapToOperator);
const notEqualToOp = str(operators.NOT_EQUAL_TO).map(mapToOperator);
const booleanOperator = choice([
  lessThanOp,
  greaterThanOp,
  equalToOp,
  notEqualToOp,
]);
// - String
const concatOp = char(operators.CONCAT).map(mapToOperator);
const stringOperator = choice([
  concatOp,
]);
// - Struct
const accessOp = str(operators.ACCESS).map(mapToOperator);

// Special characters
const newLine = char('\n').map(mapToNull);
const quote = char('"');
const singleQuote = char('\'');
const space = char(' ').map(mapToNull);
// TODO: Make sure name isn't in keywords or just a number
const funcOrProcName = many1(choice([
  letters,
  digits,
]));
const funcName = funcOrProcName.map(mapToFuncName);
const procName = funcOrProcName.map(mapToProcName);
const variableName = sequenceOf([
  char('$'),
  many1(choice([
    letter,
    digit,
  ])).map(l => l.join('')),
]).map(x => x.join('')).map(mapToVariableName).map(debug('variable name'));
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
  char('\''),
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
  digits,
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

const arithmeticExpression = recursiveParser(() => (
  choice([
    between(startGroupOp)(endGroupOp)(sequenceOf([
      choice([
        arithmeticExpression,
        primitive,
        variableName,
      ]),
      space,
      choice([
        arithmeticOperator,
      ]),
      space,
      choice([
        arithmeticExpression,
        primitive,
        variableName,
      ]),
    ])).map(([left,, op,, right]) => ({
      type: 'expression',
      left,
      right,
      operator: op,
    })),
    variableName,
  ])
));

const booleanExpression = recursiveParser(() => (
  choice([
    between(startGroupOp)(endGroupOp)(sequenceOf([
      choice([
        booleanExpression,
        primitive,
        variableName,
      ]),
      space,
      choice([
        booleanOperator,
      ]),
      space,
      choice([
        booleanExpression,
        primitive,
        variableName,
      ]),
    ])).map(([left,, op,, right]) => ({
      type: 'expression',
      left,
      right,
      operator: op,
    })),
    variableName,
  ])
));

const stringExpression = recursiveParser(() => (
  choice([
    between(startGroupOp)(endGroupOp)(sequenceOf([
      choice([
        stringExpression,
        primitive,
        variableName,
      ]),
      space,
      choice([
        stringOperator,
      ]),
      space,
      choice([
        stringExpression,
        primitive,
        variableName,
      ]),
    ])).map(([left, , op, , right]) => ({
      type: 'expression',
      left,
      right,
      operator: op,
    })),
    variableName,
  ])
));

const expression = choice([
  arithmeticExpression,
  booleanExpression,
  stringExpression,
]);

const arrayValue = between(char('['))(char(']'))(sepBy(str(', '))(choice([
  variableName,
  primitive,
  expression,
]))).map(mapToArray);

// Built-in methods
// Methods categorized by return values
let arrayMethod;
let booleanMethod;
let characterMethod;
let floatMethod;
let stringMethod;
const arrayLenMethod = recursiveParser(() => (sequenceOf([
  choice([
    variableName,
    arrayValue,
    arrayMethod,
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
  }))));
const arraySliceMethod = recursiveParser(() => (sequenceOf([
  choice([
    variableName,
    arrayValue,
    arrayMethod,
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
  }))));
const charToStringMethod = recursiveParser(() => (sequenceOf([
  choice([
    characterValue,
    variableName,
    characterMethod, // Not defined yet
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
  }))));
const stringLenMethod = recursiveParser(() => (sequenceOf([
  choice([
    variableName,
    stringExpression,
    stringValue,
    stringMethod,
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
  }))));
const stringCharMethod = recursiveParser(() => (sequenceOf([
  choice([
    variableName,
    stringExpression,
    stringValue,
    stringMethod,
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
  }))));
const stringSliceMethod = recursiveParser(() => (sequenceOf([
  choice([
    variableName,
    stringExpression,
    stringValue.map(debug('string value')),
    stringMethod,
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
  }))));

// Methods categorized by return values
arrayMethod = recursiveParser(() => (choice([
  arrayLenMethod,
  arraySliceMethod,
])));

booleanMethod = recursiveParser(() => (choice([
  // TODO: string to boolean "TRUE" or "FALSE"
  // TODO: float to boolean "1" or "0", only check first part of float
])));

characterMethod = recursiveParser(() => (choice([
  stringCharMethod,
])));

floatMethod = recursiveParser(() => (choice([
  arrayLenMethod,
  stringLenMethod,
])));

stringMethod = recursiveParser(() => (choice([
  charToStringMethod,
  stringSliceMethod,
])));


const booleanStatement = choice([
  booleanExpression,
  // booleanMethod,
  booleanValue,
  // TODO: Determine valid boolean statement
]);
const characterStatement = choice([
  characterValue,
  variableName,
  characterMethod,
]);
const stringStatement = choice([
  // FIXME: Moving this top the top of stringMethod gets an error!
  sequenceOf([ 
    choice([
      variableName,
      stringExpression,
      stringValue.map(debug('string value')),
      stringMethod,
    ]).map(debug('string expr')),
    accessOp.map(debug('access op')),
    str('slice'),
    space,
    arrayValue.map(debug('slice array')),
  ])
    .map(([parent, op, method,, args]) => ({
      type: 'method',
      returnType: types.String,
      parent,
      method,
      arguments: args,
      operator: op,
    })),
  stringValue,
  variableName, // TODO: Check that variable is type string
  stringMethod,
]);
const floatStatement = choice([
  arithmeticExpression,
  variableName,
  floatValue,
  floatMethod,
]);
const arrayStatement = choice([
  arrayValue,
  arrayMethod,
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
