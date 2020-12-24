import React from 'react';
import Avatar from '../Avatar';
import Purse from '../Purse';
import { useUser, useRound } from '../../state';
import styles from './index.module.css';

function Player() {
  const [{ id: userId }] = useUser();
  const { round } = useRound();

  const player = (
    round
      ?.players
      ?.find((player) => player.userId === userId)
  );

  const bankroll = (
    player?.purse
      ? parseInt(player.purse.bankroll, 10)
      : null
  );

  const wagered = (
    player?.purse
      ? parseInt(player.purse.wagered, 10)
      : null
  );
  
  return (
    <div className={ styles.container }>
      <Avatar
        className={ styles.avatar }
        userId={ userId }
      />
      <p className={ styles.name }>
        { player?.name }
      </p>
      <Purse
        size="large"
        amount={
          bankroll && wagered
            ? bankroll - wagered
            : null
        }
      />
    </div>
  );
}

export default Player;
