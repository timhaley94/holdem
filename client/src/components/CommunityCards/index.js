import React from 'react';
import _ from 'lodash';
import Card from '../Card';
import { useRound } from '../../state';
import styles from './index.module.css';

function CommunityCards() {
  const { round } = useRound();
  return (
    <div className={styles.container}>
      {
        _.range(0, 5).map((i) => {
          const value = round?.communityCards?.[i] || null;
          return (
            <Card
              key={`${i}${value}`}
              value={value}
            />
          );
        })
      }
    </div>
  );
}

export default CommunityCards;
