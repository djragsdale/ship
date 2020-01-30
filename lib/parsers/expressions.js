const {
  between,
  char,
  choice,
  digits,
  letter,
  letters,
  possibly,
  recursiveParser,
  sepBy,
  sequenceOf,
  str,
} = require('arcsecond');

const {
  mapToArray,
} = require('./mappers');
const {
  accessOp,
  startGroupOp,
  endGroupOp,
  arithmeticOperator,
  booleanOperator,
  stringOperator,
} = require('./operators');
const {
  primitive,
} = require('./primitives');
const {
  space,
  variableName,
} = require('./specialCharacters');

const createArrayValueParser = (expr) => (
  between(char('['))(char(']'))(sepBy(str(', '))(choice([
    // This can probably just be expr
    variableName,
    primitive,
    expr,
  ]))).map(mapToArray)
);

// TODO: Check for method or property access here
const expression = recursiveParser(() => {
  const arrayParser = createArrayValueParser(expression);

  const methodExpression = sequenceOf([
    // Start with primitives, but maybe allow expressions later for method chaining
    choice([
      primitive,
      arrayParser,
    ]),
    accessOp,
    // str('str'), // hardcoded for char->str method for now
    sequenceOf([
      letter,
      choice([
        digits,
        letters,
      ]),
    ]).map((m) => m.join('')),
    possibly(space),
    possibly(arrayParser),
  ]).map(([parent, op, method,, args]) => ({
    type: 'method',
    // returnType: types.Float,
    parent,
    method,
    arguments: (args && args.value) || [],
    operator: op,
  }));

  // I should be able to combine all expression types, but keep them separate for now
  const arithmeticExpression = recursiveParser(() => (
    choice([
      between(startGroupOp)(endGroupOp)(sequenceOf([
        choice([
          expression, // arithmeticExpression,
          primitive,
          variableName,
        ]),
        space,
        choice([
          arithmeticOperator,
        ]),
        space,
        choice([
          expression, // arithmeticExpression,
          primitive,
          variableName,
        ]),
      ])).map(([left,, op,, right]) => ({
        type: 'expression',
        left,
        right,
        operator: op,
      })),
    ])
  ));

  const booleanExpression = recursiveParser(() => (
    choice([
      between(startGroupOp)(endGroupOp)(sequenceOf([
        choice([
          expression, // booleanExpression,
          primitive,
          variableName,
        ]),
        space,
        choice([
          booleanOperator,
        ]),
        space,
        choice([
          expression, // booleanExpression,
          primitive,
          variableName,
        ]),
      ])).map(([left,, op,, right]) => ({
        type: 'expression',
        left,
        right,
        operator: op,
      })),
    ])
  ));

  const stringExpression = recursiveParser(() => (
    choice([
      between(startGroupOp)(endGroupOp)(sequenceOf([
        choice([
          expression, // stringExpression,
          primitive,
          variableName,
        ]),
        space,
        choice([
          stringOperator,
        ]),
        space,
        choice([
          expression, // stringExpression,
          primitive,
          variableName,
        ]),
      ])).map(([left,, op,, right]) => ({
        type: 'expression',
        left,
        right,
        operator: op,
      })),
    ])
  ));

  return choice([
    // What if the primitive has a method?
    methodExpression,
    primitive,
    variableName,
    arithmeticExpression,
    booleanExpression,
    stringExpression,
  ]);
});

const arrayValue = createArrayValueParser(expression);

module.exports = {
  // arithmeticExpression,
  arrayValue,
  // booleanExpression,
  // stringExpression,
  expression,
};
