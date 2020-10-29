function deepMap(array, fn) {
  return array.map((val) => {
    if (Array.isArray(val)) {
      return deepMap(val, fn);
    }

    return fn(val);
  });
}

module.exports = deepMap;
