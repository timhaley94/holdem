import React from 'react';
import { Card } from '@material-ui/core';
import Opponents from '../Opponents';
import CommunityCards from '../CommunityCards';
import Pot from '../Pot';
import Player from '../Player';
import styles from './index.module.css';

function Game() {
  return (
    <Card className={ styles.container }>
      <Opponents />
      <CommunityCards />
      <Pot />
      <Player />
    </Card>
  );
}

export default Game;
