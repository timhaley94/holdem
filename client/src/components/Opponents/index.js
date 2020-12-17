import React from 'react';
import Opponent from '../Opponent';
import { useUser, useRound } from '../../state';
import styles from './index.module.css';

function Opponents() {
  const [{ id: userId }] = useUser();
  const { round } = useRound();
  const players = round?.players || [];

  return (
    <div className={ styles.container }>
      {
        players
          .filter((player) => player.userId !== userId)
          .map((player) => (
            <Opponent { ...player } />
          ))
      }
    </div>
  );
}

export default Opponents;
