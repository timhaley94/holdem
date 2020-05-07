import React, {
  createContext,
  useContext,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { useObjectState } from '../hooks';
import { useSocket } from './socket';

const Context = createContext(null);

function GamesProvider({ children }) {
  const { socket, isConnected } = useSocket();
  const [games, setGames, unsetKey] = useObjectState(null);

  useEffect(() => {
    if (socket && isConnected) {
      socket.on('game_list', (data) => {
        setGames(
          data.reduce(
            (acc, item) => ({
              ...acc,
              [item.id]: item,
            }),
            {},
          ),
        );
      });

      socket.on('game_list_item', (item) => {
        setGames({
          [item.id]: item,
        });
      });

      socket.on('game_list_item_removed', (id) => {
        unsetKey(id);
      });

      socket.emit('game_list_request');
    }
  }, [socket, isConnected, setGames, unsetKey]);

  return (
    <Context.Provider value={{ games: Object.values(games) }}>
      { children }
    </Context.Provider>
  );
}

GamesProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useGames() {
  return useContext(Context);
}

export { GamesProvider, useGames };
