const {
  choice,
  str,
} = require('arcsecond');

const keywords = require('../constants/keywords');

const __columnKeyword = str(keywords.__COLUMN); // eslint-disable-line no-underscore-dangle
const __lineKeyword = str(keywords.__LINE); // eslint-disable-line no-underscore-dangle
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

module.exports = {
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
};
