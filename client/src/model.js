import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import io from 'socket.io-client';
import config from './config';

const Context = createContext(null);

export function ModelProvider({ children }) {
  const [_socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io(config.serverUrl);

    socket.on('connect', function() {
      setIsConnected(true);
    });

    socket.on('game_state_updated', function({ state }) {
      setGame(state);
      setError(null);
    });

    socket.on('error_encountered', function({ message }) {
      setError(message);
    });

    socket.on('disconnect', function() {
      setIsConnected(false);
    });

    setSocket(socket);
  }, []);

  function createGame() {
    _socket.emit('new_game');
  }

  function joinGame(id) {
    _socket.emit('join_game', id);
  }

  function startGame() {
    _socket.emit('start_game');
  }

  function leaveGame() {
    _socket.emit('leave_game');
  }

  function makeMove(data) {
    _socket.emit('make_move', data);
  }

  const value = {
    isConnected,
    game,
    error,
    createGame,
    joinGame,
    startGame,
    leaveGame,
    makeMove
  };

  return (
    <Context.Provider value={ value }>
      { children }
    </Context.Provider>
  );
}

export function useModel() {
  return useContext(Context);
}
