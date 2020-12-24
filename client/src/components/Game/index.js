import React from 'react';
import { Card } from '@material-ui/core';
import Opponents from '../Opponents';
import CommunityCards from '../CommunityCards';
import Pot from '../Pot';
import Player from '../Player';
import PocketCards from '../PocketCards';
import Controls from '../Controls';
import styles from './index.module.css';

function Game() {
  return (
    <Card className={ styles.container }>
      <Opponents />
      <CommunityCards />
      <Pot />
      <div className={ styles.bottom }>
        <Player />
        <PocketCards />
        <Controls />
      </div>
    </Card>
  );
}

export default Game;
