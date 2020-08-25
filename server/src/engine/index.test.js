const Engine = require('./engine');
const Index = require('./index');

describe('Engine', () => {
  it('exports Engine.engine', () => {
    expect(Index).toBe(Engine);
  });
});
