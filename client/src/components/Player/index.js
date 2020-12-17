import React from 'react';
import Purse from '../Purse';
import PocketCards from '../PocketCards';
import Controls from '../Controls';
import styles from './index.module.css';

function Player() {
  return (
    <div className={styles.container}>
      <Purse />
      <PocketCards />
      <Controls />
    </div>
  );
}

export default Player;
