import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from '../hooks';
import { Rooms } from '../api';
import { useSocket } from './socket';

const Context = createContext(null);

const initialState = {
  initialized: false,
  rooms: {},
  ids: [],
};

const INIT = Symbol('init');
const SET = Symbol('set');
const UNSET = Symbol('unset');

function reducer(state, { type, value }) {
  switch (type) {
    case INIT:
      return {
        ...state,
        initialized: true,
        ids: value.map((room) => room._id),
        rooms: value.reduce(
          (acc, room) => ({
            ...acc,
            [room._id]: {
              ...room,
              id: room._id,
            },
          }),
          {},
        ),
      };
    case SET:
      return {
        ...state,
        ids: (
          state.ids.includes(value._id)
            ? state.ids
            : [...state.ids, value._id]
        ),
        rooms: {
          ...state.rooms,
          [value._id]: {
            ...value,
            id: value._id,
          },
        },
      };
    case UNSET:
      const copy = { ...state.rooms };
      delete copy[value];

      return {
        ...state,
        ids: state.ids.filter((id) => id !== value),
        rooms: copy,
      };
    default:
      return state;
  }
}

function RoomsProvider({ children }) {
  const [
    { rooms, ids },
    dispatch,
  ] = useReducer(reducer, initialState);
  const { socket } = useSocket();

  useAsyncEffect(async (isValid) => {
    const { data } = await Rooms.list();

    if (isValid()) {
      dispatch({
        type: INIT,
        value: data,
      });
    }
  }, [dispatch]);

  useEffect(() => {
    if (socket) {
      const set = (room) => {
        dispatch({
          type: SET,
          value: room,
        });
      };

      const unset = (id) => {
        dispatch({
          type: UNSET,
          value: id,
        });
      };

      socket.on('room_updated', set);
      socket.on('room_deleted', unset);

      return () => {
        socket.off('room_updated', set);
        socket.off('room_deleted', unset);
      };
    }
  }, [socket, dispatch]);

  const value = ids.map((id) => rooms[id]);

  const create = useCallback(async (data) => {
    const { data: room } = await Rooms.create(data);

    dispatch({
      type: SET,
      value: room,
    });

    return {
      ...room,
      id: room._id,
    };
  }, [dispatch]);

  return (
    <Context.Provider value={{ create, rooms: value }}>
      { children }
    </Context.Provider>
  );
}

RoomsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useRooms() {
  return useContext(Context);
}

export { RoomsProvider, useRooms };
