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
      propExpression,
      variableName,
      primitive,
      arrayParser,
    ]),
    accessOp,
    sequenceOf([
      letter,
      choice([
        digits,
        letters,
      ]),
    ]).map((m) => m.join('')),
    possibly(sequenceOf([
      space,
      arrayParser,
    ]).map(([, args]) => args)),
  ]).map(([parent, op, method, args]) => ({
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
        arithmeticOperator,
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
        booleanOperator,
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
        // If I don't add the space in here then it may capture something not followed by a space
        choice([
          sequenceOf([expression, space]),
          sequenceOf([primitive, space]),
          sequenceOf([variableName, space]),
        ]).map(([val]) => val),
        stringOperator,
        space,
        choice([
          expression, // stringExpression,
          primitive,
          variableName,
        ]),
      ])).map(([left, op,, right]) => ({
        type: 'expression',
        left,
        right,
        operator: op,
      })),
    ])
  ));

  return choice([
    methodExpression,
    propExpression,
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
