function hasEqualIds(a, b) {
  const toString = (x) => {
    const id = x._id || x.id || x;
    return typeof id == 'string' ? id : id.toString();
  };

  return toString(a) === toString(b);
}

async function expectThrows(fn, err) {
  expect.assertions(1);

  try {
    await fn();
  } catch (e) {
    expect(e instanceof err).toBe(true);
  }
}

function expectEqualIds(a, b) {
  expect(
    hasEqualIds(a, b)
  ).toEqual(true);
}

module.exports = {
  hasEqualIds,
  expectThrows,
  expectEqualIds,
};
