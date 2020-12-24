import React from 'react';
import Card from '../Card';
import { useUser, useRound } from '../../state';
import styles from './index.module.css';

function Purse() {
  const [{ id: userId }] = useUser();
  const { round } = useRound();
  const cards = (
    round
      ?.players
      ?.find((player) => player.userId === userId)
      ?.pocketCards
  );

  return (
    <div className={styles.container}>
      {
        cards
          ? (
            cards.map((card) => (
              <Card
                key={card}
                value={card}
                size="medium"
              />
            ))
          )
          : null
      }
    </div>
  );
}

export default Purse;
