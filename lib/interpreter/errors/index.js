/* eslint-disable global-require */
module.exports = {
  reference: {
    funcAlreadyExists: require('./reference/funcAlreadyExists'),
    funcDoesNotExist: require('./reference/funcDoesNotExist'),
    procAlreadyExists: require('./reference/procAlreadyExists'),
    procDoesNotExist: require('./reference/procDoesNotExist'),
    propOfUndefined: require('./reference/propOfUndefined'),
    structAlreadyExists: require('./reference/structAlreadyExists'),
    structInvalidProp: require('./reference/structInvalidProp'),
    variableAlreadyExists: require('./reference/variableAlreadyExists'),
    variableDoesNotExist: require('./reference/variableDoesNotExist'),
  },
  syntax: {
    expressionNotRecognized: require('./syntax/expressionNotRecognized'),
    floatExponentError: require('./syntax/floatExponentError'),
    floatParseError: require('./syntax/floatParseError'),
    keywordNotRecognized: require('./syntax/keywordNotRecognized'),
    methodNotRecognized: require('./syntax/methodNotRecognized'),
    operatorNotRecognized: require('./syntax/operatorNotRecognized'),
  },
  type: {
    assignmentMismatch: require('./type/assignmentMismatch'),
    expressionMismatch: require('./type/expressionMismatch'),
    inputMismatch: require('./type/inputMismatch'),
  },
};
/* eslint-enable global-require */
