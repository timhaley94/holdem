import React from 'react';
import PropTypes from 'prop-types';

function Purse({ wagered, bankroll }) {
  return (
    <div>
      <p>
        $
        { parseInt(bankroll, 10) - parseInt(wagered, 10) }
      </p>
    </div>
  );
}

const type = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);

Purse.propTypes = {
  wagered: type.isRequired,
  bankroll: type.isRequired,
};

export default Purse;
