const Errors = require('../errors');
const Auth = require('./index');

describe('Models.Auth', () => {
  const data = {
    foo: 1,
    bar: [{ baz: 2 }],
  };

  describe('.sign()', () => {
    it('can sign arbitray data', () => {
      expect(() => {
        Auth.sign(data);
      }).not.toThrow();
    });
  });

  describe('.verify()', () => {
    it('can verify a token', () => {
      const token = Auth.sign(data);
      let decoded;

      expect(() => {
        decoded = Auth.verify({ token });
      }).not.toThrow();

      expect(decoded.data).toEqual(data);
    });

    it('throws on invalid token', () => {
      expect(() => {
        Auth.verify(data);
      }).toThrow(Errors.Unauthorized);
    });
  });
});
