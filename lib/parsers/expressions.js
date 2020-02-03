const {
  between,
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
  arrLeft,
  arrRight,
  space,
  variableName,
} = require('./specialCharacters');

const createArrayValueParser = (expr) => (
  between(arrLeft)(arrRight)(sepBy(str(', '))(choice([
    // This can probably just be expr
    expr,
  ]))).map(mapToArray)
);

// TODO: Check for method or property access here
const expression = recursiveParser(() => {
  const arrayParser = createArrayValueParser(expression);

  const propExpression = sequenceOf([
    variableName,
    arrLeft,
    expression,
    arrRight,
  ]).map(([parent,, prop]) => ({
    type: 'prop', // ????
    parent,
    prop,
  }));

  const methodExpression = sequenceOf([
    // Start with primitives, but maybe allow method expressions later for method chaining
    choice([
      variableName,
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
    arguments: args || [],
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
    propExpression,
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
