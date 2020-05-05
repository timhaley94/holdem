import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';

function Page({ children }) {
  return (
    <div className={styles.container}>
      { children }
    </div>
  );
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Page;
