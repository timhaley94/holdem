import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useRoom } from './room';
import { useSocket } from './socket';

const Context = createContext(null);

const initialState = {
  subscribed: [],
  users: {},
};

const SET_SUBSCRIBED = Symbol('set_subscribed');
const SET_USER = Symbol('set_user');

function reducer(state, { type, value }) {
  switch (type) {
    case SET_SUBSCRIBED:
      return {
        ...state,
        subscribed: value,
      };
    case SET_USER:
      return {
        ...state,
        users: {
          ...state.users,
          [value.id]: value,
        },
      };
    default:
      return state;
  }
}

function PlayersProvider({ children }) {
  const [
    {
      users,
      subscribed,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const { socket } = useSocket();
  const { room } = useRoom();

  useEffect(() => {
    if (socket) {
      const set = (user) => dispatch({
        type: SET_USER,
        value: user,
      });

      socket.on('user_updated', set);

      return () => {
        socket.off('user_updated', set);
      };
    }
  }, [socket, dispatch]);

  const players = (
    room
      && room.players
      ? _.uniqBy(
        room.players,
        (p) => p.userId,
      )
      : []
  );

  const userIds = players.map(({ userId }) => userId);

  useEffect(() => {
    if (socket) {
      const idsToAdd = _.difference(userIds, subscribed);
      const idsToRemove = _.difference(subscribed, userIds);

      idsToAdd.forEach((id) => socket.emit('user_subscribe', id));
      idsToRemove.forEach((id) => socket.emit('user_unsubscribe', id));

      if (idsToAdd.length > 0 || idsToRemove.length > 0) {
        dispatch({
          type: SET_SUBSCRIBED,
          value: userIds,
        });
      }
    }
  }, [socket, dispatch, subscribed, userIds]);

  const value = players.map((player) => {
    const user = users[player.userId] || {};
    return {
      ...user,
      ...player,
      id: player.userId,
      _id: player.userId,
    };
  });

  return (
    <Context.Provider value={{ players: value }}>
      { children }
    </Context.Provider>
  );
}

PlayersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function usePlayers() {
  return useContext(Context);
}

export { PlayersProvider, usePlayers };
