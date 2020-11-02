const { create } = require('./index');

describe('Modules.Listener', () => {
  describe('.create()', () => {
    describe('.listen()', () => {
      it('fires on all changes', () => {
        const listener = create();
        const fn = jest.fn();

        listener.listen(fn);
        listener.emit(1);
        listener.emit(2);

        expect(fn.mock.calls.length).toBe(2);
        expect(fn.mock.calls[0][0]).toBe(1);
        expect(fn.mock.calls[1][0]).toBe(2);

        listener.unlisten(fn);
      });
    });

    describe('.unlisten()', () => {
      it('doesn\'t fire after unlisten', () => {
        const listener = create();
        const fn = jest.fn();

        listener.listen(fn);
        listener.emit(1);

        listener.unlisten(fn);
        listener.emit(2);

        expect(fn.mock.calls.length).toBe(1);
      });
    });

    describe('.subscribe()', () => {
      it('only fires on specific id', () => {
        const listener = create();
        const fn = jest.fn();

        listener.subscribe(1, fn);
        listener.emit(1);
        listener.emit(2);

        expect(fn.mock.calls.length).toBe(1);

        listener.unsubscribe(1, fn);
      });
    });

    describe('.unsubscribe()', () => {
      it('doesn\'t fire after unsubscribe', () => {
        const listener = create();
        const fn = jest.fn();

        listener.subscribe(1, fn);
        listener.emit(1);

        listener.unsubscribe(1, fn);
        listener.emit(1);

        expect(fn.mock.calls.length).toBe(1);
      });
    });
  });
});
