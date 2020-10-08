import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useArrayState } from '../hooks';
import { useRooms } from './rooms';
import { useSocket } from './socket';
import { useUser } from './user';
import { Rooms } from '../api';

const Context = createContext(null);

function RoomProvider({ children }) {
  const { rooms } = useRooms();
  const [roomId, setRoomId] = useState(null);
  const { socket } = useSocket();
  const [{ token, id: userId }] = useUser();
  const [
    messages,
    addMessage,
    pullMessage, // eslint-disable-line no-unused-vars
    setMessages,
  ] = useArrayState();

  useEffect(() => {
    if (socket) {
      socket.on('room_message', addMessage);

      return () => {
        socket.off('room_message', addMessage);
      };
    }
  }, [socket, addMessage]);

  const leave = useCallback(async () => {
    if (socket) {
      socket.emit('room_leave');
    }

    setMessages([]);
    setRoomId(null);

    await Rooms.leave({
      id: roomId,
      token,
      userId,
    });
  }, [
    socket,
    setMessages,
    setRoomId,
    roomId,
    token,
    userId,
  ]);

  const join = useCallback(async (id) => {
    await Rooms.join({ id, token });

    if (socket) {
      socket.emit('room_join', id);
    }

    setMessages([]);
    setRoomId(id);
  }, [
    socket,
    setMessages,
    setRoomId,
    token,
  ]);

  const setReady = useCallback(async (isReady) => {
    await Rooms.setReady({
      id: roomId,
      token,
      userId,
      isReady,
    });
  }, [roomId, userId, token]);

  const sendMessage = useCallback((message) => {
    if (socket) {
      socket.emit('room_send_message', message);
    }
  }, [socket]);

  const room = (
    rooms
      && roomId
      ? rooms.find(({ id }) => id === roomId)
      : null
  );

  const value = {
    room: room || null,
    messages,
    join,
    leave,
    setReady,
    sendMessage,
  };

  return (
    <Context.Provider value={value}>
      { children }
    </Context.Provider>
  );
}

RoomProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useRoom() {
  return useContext(Context);
}

export { RoomProvider, useRoom };
