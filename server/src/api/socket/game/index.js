const { Game } = require('../../../domain');
const Views = require('../../views');
const events = require('../events');

const socketRoomName = (id) => `game-${id}`;

function onStart(io) {
  Game.listener.listen(
    async (id) => {
      const game = await Game.retrieve({ id });

      io.in(socketRoomName(id)).emit(
        events.game.updated,
        Views.User(game),
      );
    },
  );
}

async function subscribe(socket, id) {
  const game = await Game.retrieve({ id });

  socket.emit(
    events.game.updated,
    Views.Game(game),
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

  socket.on(events.game.subscribe, wrap(subscribe));
  socket.on(events.game.unsubscribe, wrap(unsubscribe));
}

module.exports = {
  onStart,
  onConnect,
};
