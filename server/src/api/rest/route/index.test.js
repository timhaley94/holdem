
const { Renderer } = require('../../views');
const Route = require('./index');

describe('API.Rest.Route', () => {
  describe('.handler()', () => {
    const testId = 'testidtestidtestidtestid';

    const view = Renderer.wrap({ fields: ['foo'] });
    const req = {
      user: {
        data: {
          id: testId,
        },
      },
    };

    const getRes = () => ({
      status: jest.fn(),
      json: jest.fn(),
    });

    const detailFn = () => Promise.resolve({
      foo: 1,
      bar: 2,
    });

    const listFn = async () => ([
      await detailFn(),
      await detailFn(),
    ]);

    const errorFn = () => Promise.reject(new Error('test'));

    const getRoute = (fn, v = view) => Route.handler(fn, v);

    it('serializes individual objects', async () => {
      const res = getRes();
      const route = getRoute(detailFn);

      await route(req, res);

      expect(res.json).toBeCalledWith({
        foo: 1,
      });
    });

    it('serializes list', async () => {
      const res = getRes();
      const route = getRoute(listFn);

      await route(req, res);

      expect(res.json).toBeCalledWith([
        { foo: 1 },
        { foo: 1 },
      ]);
    });

    it('passes context to view', async () => {
      const res = getRes();
      const mockView = jest.fn();
      const route = getRoute(detailFn, mockView);

      await route(req, res);

      expect(mockView).toBeCalledWith(
        expect.anything(),
        { userId: testId },
      );
    });

    it('sends 200', async () => {
      const res = getRes();
      const route = getRoute(detailFn);

      await route(req, res);

      expect(res.status).toBeCalledWith(200);
    });

    it('handles errors', async () => {
      const res = getRes();
      const route = getRoute(errorFn);
      const next = jest.fn();

      await route(req, res, next);

      expect(res.json).not.toBeCalled();
      expect(next).toBeCalledWith(
        expect.any(Error),
      );
    });
  });
});
