const Errors = require('../errors');
const Auth = require('./index');

describe('Modules.Auth', () => {
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
      const decoded = Auth.verify({ token });

      expect(decoded).toEqual(data);
    });

    it('throws on invalid token', () => {
      expect(() => {
        Auth.verify(data);
      }).toThrow(Errors.Unauthorized);
    });
  });
});
