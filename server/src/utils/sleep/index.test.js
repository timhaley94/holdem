const sleep = require('./index');

describe('Utils.sleep', () => {
  it('waits to resolve', async () => {
    const start = new Date();
    await sleep(300);
    const end = new Date();

    expect(end - start).toBeGreaterThanOrEqual(300);
  });
});
