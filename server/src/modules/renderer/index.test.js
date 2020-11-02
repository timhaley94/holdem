const { wrap } = require('./index');

describe('Modules.renderer', () => {
  describe('.wrap()', () => {
    it('returns function', () => {
      const fn = wrap({
        fields: ['foo'],
      });

      expect(typeof fn).toEqual('function');
    });

    it('includes all fields', () => {
      const fields = ['foo', 'bar', 'bax'];
      const fn = wrap({ fields });

      const data = {
        foo: 1,
        bar: 2,
        baz: 3,
      };

      const result = fn(data);

      fields.forEach((field) => {
        expect(result[field]).toEqual(data[field]);
      });
    });

    it('ignores unincluded fields', () => {
      const fields = ['foo', 'bar', 'bax'];
      const fn = wrap({ fields });

      const data = {
        foo: 1,
        bar: 2,
        baz: 3,
        buq: 4,
      };

      const result = fn(data);
      expect(result.buq).toBeUndefined();
    });

    it('always includes id', () => {
      const fields = ['foo'];
      const fn = wrap({ fields });

      const data = {
        _id: 'id12345',
        foo: 1,
      };

      const result = fn(data);
      expect(result.id).toEqual(data._id);
    });

    it('utilizes mappings', () => {
      const fields = ['foo', 'bar'];
      const mapping = {
        bar: (x) => x ** 2,
      };

      const fn = wrap({ fields, mapping });

      const data = {
        foo: 1,
        bar: 2,
      };

      const result = fn(data);

      expect(result.foo).toEqual(data.foo);
      expect(result.bar).toEqual(
        mapping.bar(data.bar),
      );
    });
  });
});
