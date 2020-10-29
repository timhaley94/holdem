const initialState = {
  result: [],
  last: null,
  chunk: [],
};

function flattenIfSingle(array) {
  return array.length > 1 ? array : array[0];
}

function resolveChunk(acc, val) {
  const next = {
    ...acc,
    last: val,
    chunk: [val],
  };

  if (acc.chunk.length > 0) {
    next.result = [
      ...acc.result,
      flattenIfSingle(acc.chunk),
    ];
  }

  return next;
}

function extendChunk(acc, val) {
  return {
    ...acc,
    last: val,
    chunk: [
      ...acc.chunk,
      val,
    ],
  };
}

function chunkIf(array, fn) {
  const reduced = array.reduce(
    (acc, val) => {
      if (acc.last && fn(acc.last, val)) {
        // If fn(...) returns true, extend chunk
        return extendChunk(acc, val);
      }

      // Otherwise resolve chunk
      return resolveChunk(acc, val);
    },
    initialState,
  );

  return [
    ...reduced.result,
    flattenIfSingle(reduced.chunk),
  ];
}

module.exports = chunkIf;
