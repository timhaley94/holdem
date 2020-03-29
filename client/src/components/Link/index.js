import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';

function Link({ href, children }) {
  return (
    <a
      className={ styles.link }
      href={ href }
      target="_blank"
      rel="noreferrer noopener"
    >
      { children }
    </a>
  );
}

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default Link;
