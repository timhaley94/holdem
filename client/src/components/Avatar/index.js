import React from 'react';
import PropTypes from 'prop-types';
import { Avatar as MUIAvatar } from '@material-ui/core';
import avatars from '../../data/avatars';
import { useSocket } from '../../state';
import styles from './index.module.css';

function Avatar({ userId }) {
  const { game } = useSocket();
  const user = game.users[userId];
  const avatarId = (
    user
      && user.metadata
      && user.metadata.avatarId
      ? user.metadata.avatarId
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
