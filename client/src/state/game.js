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

  const wrap = (fn) => {
    if (!socket || !isConnected) {
      return null;
    }

    return (...args) => fn(...args);
  };

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
    dismissError,
    sendMessage: wrap((message) => socket.emit('send_message', message)),
    joinGame: wrap((id) => socket.emit('join_game', id)),
    setReady: wrap((isReady) => socket.emit('set_ready', isReady)),
    makeMove: wrap((data) => socket.emit('make_move', data)),
    leaveGame: wrap(() => {
      setGame(null);
      socket.emit('leave_game');
    }),
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
