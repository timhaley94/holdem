import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import { generate as generateId } from 'shortid';
import { Games } from '../api';
import { useUser } from './user';
import { useRoom } from './room';
import { useSocket } from './socket';

const Context = createContext(null);

const SET_GAME = Symbol('set_game');
const SET_SUBSCRIBED_ID = Symbol('set_subscribed_id');
const PUSH_ERROR = Symbol('push_error');
const PULL_ERROR = Symbol('pull_error');

const initialState = {
  subscribedId: null,
  games: {},
  errors: [],
};

function reducer(state, { type, value }) {
  switch (type) {
    case SET_GAME:
      return {
        ...state,
        games: {
          [value._id]: {
            ...value,
            id: value._id,
          },
        },
      };
    case SET_SUBSCRIBED_ID:
      if (value !== state.subscribedId) {
        return {
          ...state,
          subscribedId: value,
          errors: [],
        };
      }

      return state;
    case PUSH_ERROR:
      return {
        ...state,
        errors: [
          ...state.errors,
          {
            id: generateId(),
            ...value,
          },
        ],
      };
    case PULL_ERROR:
      return {
        ...state,
        errors: state.errors.filter(
          ({ id }) => id !== value,
        ),
      };
    default:
      return state;
  }
}

const defaultMessage = `
  We're having trouble talking to the server.
`;

function GameProvider({ children }) {
  const [{ token }] = useUser();
  const { room } = useRoom();
  const { socket } = useSocket();
  const [
    {
      games,
      subscribedId,
      errors,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const gameId = (
    room
      && room.gameId
      ? room.gameId
      : null
  );

  useEffect(() => {
    if (socket) {
      const set = (value) => dispatch({
        type: SET_GAME,
        value,
      });

      socket.on('game_updated', set);

      return () => {
        socket.off('game_updated', set);
      };
    }
  }, [socket, dispatch]);

  useEffect(() => {
    if (socket && gameId !== subscribedId) {
      socket.emit('game_unsubscribe', subscribedId);
      socket.emit('game_subscribe', gameId);

      dispatch({
        type: SET_SUBSCRIBED_ID,
        value: gameId,
      });
    }
  }, [socket, gameId, subscribedId, dispatch]);

  const dismissError = useCallback((id) => {
    dispatch({
      type: PULL_ERROR,
      value: id,
    });
  }, [dispatch]);

  const makeMove = useCallback((data) => {
    try {
      Games.makeMove({
        id: gameId,
        token,
        ...data,
      });
    } catch ({ response }) {
      dispatch({
        type: PUSH_ERROR,
        value: response.message || defaultMessage,
      });
    }
  }, [gameId, token]);

  const value = {
    game: games[gameId] || {},
    errors,
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
