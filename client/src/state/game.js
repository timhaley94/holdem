import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { generate as generateId } from 'shortid';
import { useArrayState } from '../hooks';
import { useSocket } from './socket';

const Context = createContext(null);

function GameProvider({ children }) {
  const [game, setGame] = useState(null);
  const {
    socket,
    isConnected,
    onFatal,
  } = useSocket();

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
    socket.emit('send_message', message);
  }

  function joinGame(id) {
    socket.emit('join_game', id);
  }

  function setReady(value) {
    socket.emit('set_ready', value);
  }

  function makeMove(data) {
    socket.emit('make_move', data);
  }

  function leaveGame() {
    setGame(null);
    socket.emit('leave_game');
  }

  function dismissError(id) {
    removeError((e) => e.id === id);
  }

  useEffect(() => {
    if (socket && isConnected) {
      socket.on('room_error', onFatal);
      socket.on('incoming_message', addMessage);
      socket.on('game_state_updated', setGame);
      socket.on('game_error', ({ message }) => {
        addError({
          id: generateId(),
          message,
        });
      });
    }
  }, [
    socket,
    isConnected,
    onFatal,
    addMessage,
    setGame,
    addError,
  ]);

  const value = {
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

GameProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useGame() {
  return useContext(Context);
}

export {
  GameProvider,
  useGame,
};
