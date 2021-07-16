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
  variableName,
} = require('./dataTypes');
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
  arrayOperator,
} = require('./operators');
const {
  primitive,
} = require('./primitives');
const {
  arrLeft,
  arrRight,
  space,
} = require('./specialCharacters');

const methodName = sequenceOf([
  letter,
  choice([
    digits,
    letters,
  ]),
]).map((m) => m.join(''));

const createArrayValueParser = (expr) => (
  between(arrLeft)(arrRight)(sepBy(str(', '))(choice([
    // This can probably just be expr
    expr,
  ]))).map(mapToArray)
);

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
    methodName,
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

  const arrayExpression = recursiveParser(() => (
    choice([
      between(startGroupOp)(endGroupOp)(sequenceOf([
        choice([
          sequenceOf([expression, space]),
          sequenceOf([arrayValue, space]),
          sequenceOf([variableName, space]),
        ]).map(([val]) => val),
        arrayOperator,
        space,
        choice([
          expression, // arrayExpression, propExpression, methodExpression
          arrayValue,
          variableName,
        ])
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
    arrayExpression,
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
