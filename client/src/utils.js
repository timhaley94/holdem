export function chunkBy(array, fn) {
  const { chunks, chunk } = (
    array.reduce(
      (acc, curr) => {
        const key = fn(curr);

        if (!acc.chunk) {
          return {
            ...acc,
            chunk: {
              key,
              entries: [curr],
            },
          };
        }

        if (key === acc.chunk.key) {
          return {
            ...acc,
            chunk: {
              ...acc.chunk,
              entries: [
                ...acc.chunk.entries,
                curr,
              ],
            },
          };
        }

        return {
          ...acc,
          chunks: [
            ...acc.chunks,
            acc.chunk,
          ],
          chunk: {
            key,
            entries: [curr],
          },
        };
      },
      {
        chunks: [],
        chunk: null,
      },
    )
  );

  if (chunk) {
    return [
      ...chunks,
      chunk,
    ];
  }

  return chunks;
}

export function hasOwnProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(
    obj,
    key,
  );
}
