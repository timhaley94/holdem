import React from 'react';
import { Link } from 'react-router-dom';
import Emoji from '../Emoji';
import styles from './index.module.css';

function Header() {
  return (
    <div className={styles.container}>
      <Link to="/" className={styles.logoContainer}>
        <span
          role="img"
          aria-label="party popper"
          className={styles.logo}
        >
          🃏
        </span>
      </Link>
      <Link to="/about" className={styles.link}>About</Link>
      <a
        href="https://github.com/timhaley94/holdem"
        className={styles.link}
        target="_blank"
        rel="noreferrer noopener"
      >
        Code
        <Emoji className={styles.emoji}>🎉</Emoji>
      </a>
    </div>
  );
}

export default Header;
