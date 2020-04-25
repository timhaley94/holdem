import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '@material-ui/core';
import { avatars, useAPI } from '../../models';
import styles from './index.module.css';

function MessageGroup({ playerId, messages }) {
  const { game } = useAPI();
  const { avatarId, name } = (
    Object
      .values(game.players)
      .find(p => p.playerId === playerId)
      .data
  );

  const avatar = avatars.find(
    ({ id }) => id === avatarId
  ).image;

  const firstTimestamp = new Date(messages[0].timestamp);
  const hours = firstTimestamp.getHours();
  const minutes = firstTimestamp.getMinutes();

  return (
    <div className={ styles.container }>
      <Avatar
        className={ styles.avatar }
        src={ avatar }
      />
      <div className={ styles.content }>
        <div className={ styles.info }>
          <p className={ styles.name }>
            { name }
          </p>
          <p className={ styles.timestamp }>
            { `${hours}:${minutes}` }
          </p>
        </div>
        <div className={ styles.messages }>
          {
            messages.map(
              ({ message, timestamp }) => (
                <p
                  className={ styles.message }
                  key={ timestamp }
                >
                  { message }
                </p>
              )
            )
          }
        </div>
      </div>
    </div>
  );
}

MessageGroup.propTypes = {
  playerId: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired
    })
  ).isRequired
};

export default MessageGroup;
