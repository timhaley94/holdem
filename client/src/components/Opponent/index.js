import React from 'react';
import PropTypes from 'prop-types';
import { Card } from '@material-ui/core';
import Avatar from '../Avatar';
import Purse from '../Purse';

function Opponent({ name, userId, purse }) {
  return (
    <Card>
      <Avatar userId={userId} />
      <p>{ name }</p>
      <Purse {...purse} />
    </Card>
  );
}

Opponent.propTypes = {
  name: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  purse: PropTypes.shape(
    Purse.propTypes,
  ).isRequired,
};

export default Opponent;
