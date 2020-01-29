const {
  between,
  choice,
  recursiveParser,
  sequenceOf,
} = require('arcsecond');

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
    ])).map(([left, , op, , right]) => ({
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
    ])).map(([left, , op, , right]) => ({
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

module.exports = {
  arithmeticExpression,
  booleanExpression,
  stringExpression,
  expression,
};
