function hasShape(array, lengths) {
  if (array.length < lengths.length) {
    return null;
  }

  return lengths.every(
    (length, i) => (
      Array.isArray(array[i])
        && array[i].length >= length
    )
  );
}

module.exports = hasShape;
