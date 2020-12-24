import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Card as MUICard } from '@material-ui/core';
import Emoji from '../Emoji';
import styles from './index.module.css';

function getSuit(value) {
  return {
    c: {
      emoji: '♣️',
      color: styles.black,
    },
    d: {
      emoji: '♦️',
      color: styles.red,
    },
    h: {
      emoji: '♥️',
      color: styles.red,
    },
    s: {
      emoji: '♠️',
      color: styles.black,
    },
  }[value.toLowerCase()];
}

function getRank(value) {
  if (value <= 10) {
    return value;
  }

  return {
    11: 'J',
    12: 'Q',
    13: 'K',
    14: 'A',
  }[value];
}

function Card({ size, value }) {
  const className = classNames(
    styles.container,
    styles[size],
    {
      [styles.hidden]: !value,
    },
  );

  if (!value) {
    return <div className={className} />;
  }

  const rank = getRank(parseInt(value.slice(1), 10));
  const { emoji, color } = getSuit(value[0]);

  return (
    <MUICard className={className}>
      <p className={classNames(styles.rank, color)}>
        { rank }
        <Emoji className={classNames(styles.suit, color)}>
          { emoji }
        </Emoji>
      </p>
    </MUICard>
  );
}

Card.propTypes = {
  value: PropTypes.string,
  size: PropTypes.oneOf([
    'small',
    'medium',
    'large',
  ]),
};

Card.defaultProps = {
  value: null,
  size: 'large',
};

export default Card;
