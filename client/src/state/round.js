import React, {
  createContext,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useGame } from './game';
import { usePlayers } from './players';

const Context = createContext(null);

function RoundProvider({ children }) {
  const { players } = usePlayers();
  const { game, makeMove } = useGame();

  const round = game?.round;
  const value = {
    makeMove,
    round: {
      ...round,
      players: round?.players.map(
        (player) => ({
          ...players.find(
            (p) => p.userId === player.userId,
          ),
          ...player,
        }),
      ),
    },
  };

  return (
    <Context.Provider value={value}>
      { children }
    </Context.Provider>
  );
}

RoundProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useRound() {
  return useContext(Context);
}

export {
  RoundProvider,
  useRound,
};
