const Errors = require('./index');

describe('Models.Errors', () => {
  const tests = {
    BadRequest: 400,
    Unauthorized: 401,
  };

  Object.entries(tests).forEach(
    ([name, status]) => {
      const e = (...args) => new Errors[name](...args);

      describe(name, () => {
        it('extends HTTPError', () => {
          const error = e('foo');
          expect(error).toBeInstanceOf(Errors.HTTPError);
        });

        it('preserves message', () => {
          const message = 'bar';
          const error = e(message);
          expect(error.message).toBe(message);
        });

        it('assigns status', () => {
          const error = e('bax');
          expect(error.status).toBe(status);
        });
      });
    },
  );
});
