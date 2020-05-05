import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useAsyncEffect } from '../hooks';
import { Games } from '../api';

const Context = createContext(null);

function GamesProvider({ children }) {
  const [games, setGames] = useState(null);
  const [game, setGame] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useAsyncEffect(async (isValid) => {
    const result = await Games.list();

    if (isValid()) {
      setGames(result.data);
    }

    return result.data;
  }, []);

  const create = useCallback(async (...args) => {
    setIsCreating(true);

    const result = await Games.create(...args);

    setGame(result);
    setIsCreating(false);

    return result.data;
  }, [setGame, setIsCreating]);

  const value = {
    games,
    game,
    create,
    isCreating,
  };

  return (
    <Context.Provider value={value}>
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
