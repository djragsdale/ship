const uuidv4 = require('uuid/v4');
const heap = require('./_heap');

// TODO: Set up garbage collection
// TODO: Set up memory dump for debugging

// Variable, func, proc, and prop names disallow '.'
// Scope is a uuid
// Therefore, I can reliably split on '.'

function getLookupName(scope, name) {
  return `${scope}.${name}`;
}

function getLookupSymbol(scope, name) {
  return heap[getLookupName(scope, name)];
}

// Way more useful once a Uint[] has been implemented
function malloc(scope, name) {
  // TODO: Register old symbol with GC when called on a preexisting scope+name
  const sym = Symbol(uuidv4());
  heap[getLookupName(scope, name)] = sym;
  return sym;
}

// I could do this by pointer but I'm going to keep it by scope+name for now
function massign(scope, name, value) {
  const sym = getLookupSymbol(scope, name);
  if (!sym) {
    throw new Error(`MASSIGN: No symbol corresponds to scope ${scope} and ${name}`);
  }

  heap[getLookupSymbol(scope, name)] = value;
}

function mget(scope, name) {
  // Returns undefined if symbol doesn't exist
  return heap[getLookupSymbol(scope, name)];
}

module.exports = {
  malloc,
  massign,
  mget,
};
