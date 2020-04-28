import React from 'react';
import PropTypes from 'prop-types';
import { Avatar as MUIAvatar } from '@material-ui/core';
import { avatars, useAPI } from '../../models';
import styles from './index.module.css';

function Avatar({ playerId }) {
  const { game } = useAPI();
  const { avatarId } = (
    Object
      .values(game.players)
      .find((p) => p.playerId === playerId)
      .data
  );

  const avatar = avatars.find(
    ({ id }) => id === avatarId,
  );

  return (
    <div className={styles.container}>
      <MUIAvatar
        className={styles.avatar}
        src={avatar ? avatar.image : null}
      />
    </div>
  );
}

Avatar.propTypes = {
  playerId: PropTypes.string.isRequired,
};

export default Avatar;
