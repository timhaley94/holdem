import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { usePlayers } from '../../state';
import Avatar from '../Avatar';
import styles from './index.module.css';

function MessageGroup({ userId, messages }) {
  const { players } = usePlayers();
  const player = players.find(({ id }) => id === userId);
  const name = player && player.name ? player.name : null;

  const m = moment(messages[0].timestamp);

  return (
    <div className={styles.container}>
      <Avatar userId={userId} />
      <div className={styles.content}>
        <div className={styles.info}>
          <p className={styles.name}>
            { name }
          </p>
          <p className={styles.timestamp}>
            { m.format('h:mm') }
          </p>
        </div>
        <div className={styles.messages}>
          {
            messages.map(
              ({ message, timestamp }) => (
                <p
                  className={styles.message}
                  key={timestamp}
                >
                  { message }
                </p>
              ),
            )
          }
        </div>
      </div>
    </div>
  );
}

MessageGroup.propTypes = {
  userId: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default MessageGroup;
