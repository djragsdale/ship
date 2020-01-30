const {
  between,
  char,
  choice,
  recursiveParser,
  sepBy,
  sequenceOf,
  str,
} = require('arcsecond');

const {
  mapToArray,
} = require('./mappers');
const {
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

// TODO: Check for method or property access here
const expression = recursiveParser(() => {
  const arithmeticExpression = recursiveParser(() => (
    choice([
      // What if the primitive
      primitive,
      variableName,
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
      primitive,
      variableName,
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
      primitive,
      variableName,
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
    arithmeticExpression,
    booleanExpression,
    stringExpression,
  ]);
});

const arrayValue = between(char('['))(char(']'))(sepBy(str(', '))(choice([
  variableName,
  primitive,
  expression,
]))).map(mapToArray);

module.exports = {
  // arithmeticExpression,
  arrayValue,
  // booleanExpression,
  // stringExpression,
  expression,
};
