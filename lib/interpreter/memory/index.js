const uuidv4 = require('uuid/v4');
const heap = require('./_heap');

// TODO: Set up garbage collection
// TODO: Set up memory dump for debugging
// TODO: Allow removing of memory by scope
// May need to store struct definitions here

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
function massign(scope, name, data) {
  // data param example: { type: 'string', value: 'N' }
  // console.log('massign', scope, name, data);
  const mem = getLookupSymbol(scope, name);
  if (!mem || !mem[1]) {
    throw new Error(`MASSIGN: No symbol corresponds to scope ${scope} and ${name}`);
  }

  const [dataType, sym] = mem;
  // console.log('dataType', dataType, sym);
  if (data === null) {
    heap[sym] = data;
    return;
  }

  if (dataType !== data.type) {
    throw new Error(`MASSIGN: Data for scope ${scope} and name ${name} must be of type ${dataType}`);
  }

  heap[sym] = data.value;
}

function mget(scope, name) {
  // Returns undefined if symbol doesn't exist
  const mem = getLookupSymbol(scope, name);
  // console.log('mget', scope, name, mem);
  if (!mem) {
    return undefined;
  }

  const [dataType, sym] = mem;

  return {
    type: dataType,
    value: heap[sym],
  };
}

module.exports = {
  malloc,
  massign,
  mget,
};
