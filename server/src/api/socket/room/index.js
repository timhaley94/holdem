const { Room } = require('../../../domain');
const Views = require('../../views');
const events = require('../events');

const ROOM_ID = Symbol('roomId');

const socketRoomName = (id) => `room-${id}`;

function onStart(io) {
  Room.listener.listen(
    async (id) => {
      try {
        const room = await Room.retrieve({ id });

        io.emit(
          events.room.updated,
          Views.Room(room),
        );
      } catch (_e) {
        io.emit(
          events.room.deleted,
          id,
        );
      }
    },
  );
}

function getUserId(socket) {
  return socket.decoded_token.data.id;
}

function getRoomId(socket) {
  return socket[ROOM_ID] || null;
}

function setRoomId(socket, value) {
  socket[ROOM_ID] = value; // eslint-disable-line no-param-reassign
}

async function joinRoom(socket, id) {
  setRoomId(socket, id);

  await new Promise((resolve) => {
    socket.join(
      socketRoomName(id),
      resolve,
    );
  });
}

async function leaveRoom(socket) {
  const id = getRoomId(socket);

  if (id) {
    await new Promise((resolve) => {
      socket.leave(
        socketRoomName(id),
        resolve,
      );
    });

    setRoomId(socket, null);
  }
}

function sendMessage(socket, message) {
  const userId = getUserId(socket);
  const id = getRoomId(socket);

  if (id) {
    const name = events.room.message;
    const payload = {
      message,
      userId,
      timestamp: new Date(),
    };

    socket.emit(name, payload);
    socket.to(
      socketRoomName(id),
    ).emit(name, payload);
  }
}

function onConnect(socket) {
  const wrap = (fn) => (...args) => fn(socket, ...args);

  socket.on(events.room.join, wrap(joinRoom));
  socket.on(events.room.leave, wrap(leaveRoom));
  socket.on(events.room.send_message, wrap(sendMessage));
}

async function onDisconnect(socket) {
  await leaveRoom(socket);
}

module.exports = {
  onStart,
  onConnect,
  onDisconnect,
};
