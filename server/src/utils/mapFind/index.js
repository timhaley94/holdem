function mapFind(array, fn) {
  let result = null;

  array.find((...args) => {
    const r = fn(...args);

    if (r) {
      result = r;
      return true;
    }

    return false;
  });

  return result;
}

module.exports = mapFind;