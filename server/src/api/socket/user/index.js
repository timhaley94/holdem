const { User } = require('../../../domain');
const Views = require('../../views');
const events = require('../events');

const socketRoomName = (id) => `user-${id}`;

function onStart(io) {
  User.listener.listen(
    async (id) => {
      const user = await User.retrieve({ id });

      io.in(socketRoomName(id)).emit(
        events.user.updated,
        Views.User(user),
      );
    },
  );
}

async function subscribe(socket, id) {
  const user = await User.retrieve({ id });

  socket.emit(
    events.user.updated,
    Views.User(user),
  );

  await new Promise((resolve) => {
    socket.join(
      socketRoomName(id),
      resolve,
    );
  });
}

async function unsubscribe(socket, id) {
  await new Promise((resolve) => {
    socket.leave(
      socketRoomName(id),
      resolve,
    );
  });
}

function onConnect(socket) {
  const wrap = (fn) => (...args) => fn(socket, ...args);

  socket.on(events.user.subscribe, wrap(subscribe));
  socket.on(events.user.unsubscribe, wrap(unsubscribe));
}

module.exports = {
  onStart,
  onConnect,
};
