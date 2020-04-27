import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useAPI } from '../../models';
import { Avatar } from '..';
import styles from './index.module.css';

function MessageGroup({ playerId, messages }) {
  const { game } = useAPI();
  const { name } = (
    Object
      .values(game.players)
      .find(p => p.playerId === playerId)
      .data
  );

  const m = moment(messages[0].timestamp);

  return (
    <div className={ styles.container }>
      <Avatar playerId={ playerId } />
      <div className={ styles.content }>
        <div className={ styles.info }>
          <p className={ styles.name }>
            { name }
          </p>
          <p className={ styles.timestamp }>
            { m.format('h:mm') }
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
