import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../Avatar';
import Purse from '../Purse';
import styles from './index.module.css';

function Opponent({
  name,
  userId,
  purse: { wagered, bankroll },
}) {
  return (
    <div className={styles.container}>
      <Avatar userId={userId} className={styles.avatar} />
      <h6 className={styles.name}>{ name }</h6>
      <Purse amount={parseInt(bankroll, 10) - parseInt(wagered, 10)} />
    </div>
  );
}

const numberOrString = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string,
]);

Opponent.propTypes = {
  name: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  purse: PropTypes.shape({
    wagered: numberOrString.isRequired,
    bankroll: numberOrString.isRequired,
  }).isRequired,
};

export default Opponent;
