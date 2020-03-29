import React from 'react';
import { Link } from '../../components';
import config from '../../config';
import styles from './index.module.css';

const Footer = () => (
  <footer className={ styles.container }>
    <p>
      Made by <Link href={ config.timUrl }>Tim Haley</Link> with { ' ' }
      <i className={ styles.heart + ' icon ion-heart' }></i>{ ' ' }
      in Chattanooga, TN
    </p>
  </footer>
);

export default Footer;
