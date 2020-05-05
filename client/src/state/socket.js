import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import { generate as generateId } from 'shortid';
import { useArrayState } from '../hooks';
import config from '../config';
import { useUser } from './user';

const Context = createContext(null);

function SocketProvider({ children }) {
  const { push } = useHistory();
  const [{
    id: playerId,
    token,
  }] = useUser();

  // Socket State
  const [_socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [game, setGame] = useState(null);

  const [
    errors,
    addError,
    removeError,
  ] = useArrayState();

  const [
    messages,
    addMessage,
  ] = useArrayState();

  function sendMessage(message) {
    _socket.emit('send_message', message);
  }

  function joinGame(id) {
    _socket.emit('join_game', id);
  }

  function setReady(value) {
    _socket.emit('set_ready', value);
  }

  function makeMove(data) {
    _socket.emit('make_move', data);
  }

  function leaveGame() {
    setGame(null);
    _socket.emit('leave_game');
  }

  function dismissError(id) {
    removeError((e) => e.id === id);
  }

  useEffect(() => {
    if (token) {
      const socket = io(config.serverUrl, {
        query: { token },
      });

      const reset = () => {
        setGame(null);
        setIsConnected(false);
      };

      const fatal = () => {
        // Log fatal here
        reset();
        push('/error');
      };

      socket.on('connect', () => {
        setIsConnected(true);
      });

      socket.on('connect_error', fatal);
      socket.on('connect_timeout', fatal);
      socket.on('error', fatal);
      socket.on('room_error', fatal);
      socket.on('disconnect', reset);
      socket.on('incoming_message', addMessage);
      socket.on('game_state_updated', setGame);
      socket.on('game_error', ({ message }) => {
        addError({
          id: generateId(),
          message,
        });
      });

      setSocket(socket);

      return () => {
        // Must be wrapped in anonymous function because
        // of 'this' binding inside .disconnect()
        socket.disconnect();
      };
    }
  }, [token, addError, addMessage, push]);

  const value = {
    isConnected: !!(isConnected && _socket),
    playerId,
    messages,
    game,
    errors,
    joinGame,
    setReady,
    sendMessage,
    leaveGame,
    makeMove,
    dismissError,
  };

  return (
    <Context.Provider value={value}>
      { children }
    </Context.Provider>
  );
}

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useSocket() {
  return useContext(Context);
}

export {
  SocketProvider,
  useSocket,
};
