/* eslint-disable global-require */
module.exports = {
  reference: {
    funcAlreadyExists: require('./reference/funcAlreadyExists'),
    funcDoesNotExist: require('./reference/funcDoesNotExist'),
    procAlreadyExists: require('./reference/procAlreadyExists'),
    procDoesNotExist: require('./reference/procDoesNotExist'),
    structAlreadyExists: require('./reference/structAlreadyExists'),
    structInvalidProp: require('./reference/structInvalidProp'),
    variableAlreadyExists: require('./reference/variableAlreadyExists'),
    variableDoesNotExist: require('./reference/variableDoesNotExist'),
  },
  syntax: {
    keywordNotRecognized: require('./syntax/keywordNotRecognized'),
  },
  type: {
    assignmentMismatch: require('./type/assignmentMismatch'),
    inputMismatch: require('./type/inputMismatch'),
  },
};
/* eslint-enable global-require */
