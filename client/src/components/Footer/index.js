import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
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

function Footer() {
  return (
    <footer className={ styles.container }>
      <p>
        Made by <Link href={ config.timUrl }>Tim</Link> and { ' ' }
        <Link href={ config.lauraUrl }>Laura Haley</Link> with { ' ' }
        <i className={ styles.heart + ' icon ion-heart' }></i>{ ' ' }
        in Chattanooga, TN
      </p>
    </footer>
  );
}

export default Footer;
