import React from 'react';
import PropTypes from 'prop-types';
import { Avatar as MUIAvatar } from '@material-ui/core';
import avatars from '../../data/avatars';
import { usePlayers } from '../../state';
import styles from './index.module.css';

function Avatar({ userId }) {
  const { players } = usePlayers();
  const user = players.find((p) => p.id === userId);
  const avatarId = (
    user
      && user.avatarId
      ? user.avatarId
      : null
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
  userId: PropTypes.string.isRequired,
};

export default Avatar;
