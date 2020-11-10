const {
  // onStart,
  onStop,
  // onConnect,
} = require('./index');

describe('API.Socket.User', () => {
  // const socket = () => {
  //   onStart();

  //   const s =
  // };

  afterEach(() => {
    onStop();
  });

  describe('subscribe', () => {
    it('receives updates to subscribed ids', () => {

    });

    it('does not receive updates for other ids', () => {

    });
  });

  describe('unsubscribe', () => {
    it('does not receive updates after unsubscribe', () => {

    });
  });
});
