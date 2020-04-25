import React from 'react';
import { Avatar } from '@material-ui/core';
import { avatars, useAPI } from '../../models';
import styles from './index.module.css';

export default function({ playerId }) {
  const { game } = useAPI();
  const { avatarId  } = (
    Object
      .values(game.players)
      .find(p => p.playerId === playerId)
      .data
  );

  const avatar = avatars.find(
    ({ id }) => id === avatarId
  );

  return (
    <div className={ styles.container }>
      <Avatar
        className={ styles.avatar }
        src={ avatar ? avatar.image : null }
      />
    </div>
  );
}
