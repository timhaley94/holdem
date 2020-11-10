const Joi = require('@hapi/joi');
const { Locks } = require('../../loaders');
const { Errors } = require('../../modules');
const { wrap } = require('./index');

describe('Domain.Handler', () => {
  describe('.wrap()', () => {
    const validators = {
      id: (
        Joi
          .string()
          .regex(/^[a-z0-9-]+$/)
          .min(1)
          .max(36)
      ),
      name: Joi.string().max(36),
    };

    const id = '123';
    const name = 'Jim Halpert';

    it('throws if required field is missing', async () => {
      const fn = wrap({
        validators,
        required: ['id'],
        fn: () => {},
      });

      expect.assertions(1);

      try {
        await fn({ name });
      } catch (e) {
        expect(e instanceof Errors.BadRequest).toBeTruthy();
      }
    });

    it('throws on bad data', async () => {
      const fn = wrap({
        validators,
        required: ['id'],
        fn: () => {},
      });

      expect.assertions(1);

      try {
        await fn({ id: 123 });
      } catch (e) {
        expect(e instanceof Errors.BadRequest).toBeTruthy();
      }
    });

    it('handles required and optional fields', async () => {
      const fn = wrap({
        validators,
        required: ['id'],
        optional: ['name'],
        fn: (data) => data,
      });

      const data = await fn({ id, name });

      expect(data.id).toEqual(id);
      expect(data.name).toEqual(name);
    });

    it('can take a lock', async () => {
      const unlock = jest.fn();
      const spy = jest.spyOn(Locks, 'take').mockImplementation(
        () => unlock,
      );

      const fn = wrap({
        validators,
        required: ['id'],
        optional: ['name'],
        lockModel: 'test',
        fn: (data) => data,
      });

      await fn({ id, name });

      expect(spy).toHaveBeenCalled();
      expect(unlock).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('throws if id is not included when taking a lock', async () => {
      const fn = wrap({
        validators,
        optional: ['name'],
        lockModel: 'test',
        fn: (data) => data,
      });

      expect.assertions(1);

      try {
        await fn({ name });
      } catch (e) {
        expect(e instanceof Errors.Fatal).toBeTruthy();
      }
    });
  });
});
