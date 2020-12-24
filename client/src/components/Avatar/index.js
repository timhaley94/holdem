import React from 'react';
import PropTypes from 'prop-types';
import { Avatar as MUIAvatar } from '@material-ui/core';
import classNames from 'classnames';
import avatars from '../../data/avatars';
import { usePlayers } from '../../state';
import styles from './index.module.css';

function Avatar({ className, userId }) {
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
    <div className={ classNames(className, styles.container) }>
      <MUIAvatar
        className={styles.avatar}
        src={avatar ? avatar.image : null}
      />
    </div>
  );
}

Avatar.propTypes = {
  className: PropTypes.string,
  userId: PropTypes.string.isRequired,
};

Avatar.defaultProps = {
  className: null,
};

export default Avatar;
