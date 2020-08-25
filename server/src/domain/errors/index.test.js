const Errors = require('./index');

describe('Domain.Errors', () => {
  const tests = {
    BadRequest: 400,
    Unauthorized: 401,
  };

  Object.entries(tests).forEach(
    ([name, status]) => {
      const e = (...args) => new Errors[name](...args);

      describe(name, () => {
        it('extends DomainError', () => {
          const error = e('foo');
          expect(error).toBeInstanceOf(Errors.DomainError);
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
