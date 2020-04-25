import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState
} from 'react';
import io from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import config from '../../config';
import { useMetadata } from '..';

const Context = createContext(null);

export function APIProvider({ children }) {
  const { push } = useHistory();
  const [metadata] = useMetadata();

  // API State
  const [_socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  const [{ messages }, dispatch] = useReducer(
    (state, { type, value }) => {
      switch (type) {
        case 'add':
          return {
            ...state,
            messages: [
              ...state.messages,
              value
            ]
          };
        default:
          return { ...state };
      }
    },
    { messages: [] }
  );

  function createGame() {
    setGame(null);
    _socket.emit('new_game');
  }

  function joinGame(id) {
    setGame(null);
    _socket.emit('join_game', id);
  }

  function setReady(value) {
    _socket.emit('set_ready', value);
  }

  function sendMessage(message) {
    _socket.emit('send_message', message);
  }

  function makeMove(data) {
    _socket.emit('make_move', data);
  }

  function leaveGame() {
    setGame(null);
    _socket.emit('leave_game');
  }

  function dismissError() {
    setError(null);
  }

  useEffect(() => {
    const socket = io(config.serverUrl);

    function reset() {
      setGame(null);
      setPlayerId(null);
      setIsConnected(false);
    }

    function fatal() {
      // Log fatal here
      reset();
      push('/error');
    }

    socket.on('connect', function() {
      setIsConnected(true);
    });

    socket.on('connect_error', fatal);
    socket.on('connect_timeout', fatal);
    socket.on('error', fatal);
    socket.on('disconnect', reset);

    socket.on('player_id', function(id) {
      setPlayerId(id);
    });

    socket.on('incoming_message', function(message) {
      dispatch({
        type: 'add',
        value: message
      });
    });

    socket.on('game_state_updated', function(state) {
      console.log('game_state_updated', state);
      setGame(state);
    });

    socket.on('game_error', function({ message }) {
      setError(message);
    });

    setSocket(socket);

    return () => {
      // Must be wrapped in anonymous function because
      // of 'this' binding inside .disconnect()
      socket.disconnect();
    };
  }, [push]);

  useEffect(() => {
    console.log('use effect');
    console.log(
      _socket,
      playerId,
      isConnected,
      metadata,
      game,
    )
    if (
      _socket
      && playerId
      && isConnected
      && metadata
      && game
      && game.players
      && game.players[playerId]
    ) {
      console.log('run');
      const storedData = game.players[playerId].data || {};
      const matches = Object.entries(metadata).every(
        ([key, value]) => storedData[key] === value
      );

      console.log(matches);
      if (!matches) {
        _socket.emit('set_data', metadata);
      }
    }
  }, [_socket, game, isConnected, metadata, playerId]);

  const value = {
    isConnected,
    playerId,
    messages,
    game,
    error,
    createGame,
    joinGame,
    setReady,
    sendMessage,
    leaveGame,
    makeMove,
    dismissError,
  };

  return (
    <Context.Provider value={ value }>
      { children }
    </Context.Provider>
  );
}

export function useAPI() {
  return useContext(Context);
}