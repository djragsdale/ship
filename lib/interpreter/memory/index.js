const uuidv4 = require('uuid/v4');
const heap = require('./_heap');

// TODO: Set up garbage collection
// TODO: Set up memory dump for debugging
// TODO: Allow removing of memory with scope

// Int8Array consists of individual bytes
// If my heap is that, then

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
function malloc(scope, name, dataType) {
  // TODO: Register old symbol with GC when called on a preexisting scope+name
  const sym = Symbol(uuidv4());
  // console.log('malloc', scope, name, dataType, sym);
  heap[getLookupName(scope, name)] = [dataType, sym];
  return sym;
}

// I could do this by pointer but I'm going to keep it by scope+name for now
function massign(scope, name, value) {
  // TODO: Do not store type with the value but instead read from the lookup table
  // value param example: { type: 'string', value: 'N' }
  // TODO: Verify dataType somehow
  const mem = getLookupSymbol(scope, name);
  if (!mem || !mem[1]) {
    throw new Error(`MASSIGN: No symbol corresponds to scope ${scope} and ${name}`);
  }

  heap[mem[1]] = value;
}

function mget(scope, name) {
  // Returns undefined if symbol doesn't exist
  const mem = getLookupSymbol(scope, name);
  if (!mem) {
    return undefined;
  }

  const [, sym] = mem;

  return heap[sym];
}

module.exports = {
  malloc,
  massign,
  mget,
};
