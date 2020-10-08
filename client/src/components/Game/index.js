import React from 'react';
import { Card } from '@material-ui/core';
import styles from './index.module.css';

function Game() {
  return (
    <Card className={styles.container}>
      <p>Hi from game</p>
    </Card>
  );
}

export default Game;
