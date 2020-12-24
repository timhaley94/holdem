import React from 'react';
import PropTypes from 'prop-types';

function Emoji({ className, children }) {
  return (
    <span
      role="img"
      aria-label="party popper"
      className={ className }
    >
      { children }
    </span>
  );
}

Emoji.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Emoji.defaultProps = {
  className: null,
};

export default Emoji;
