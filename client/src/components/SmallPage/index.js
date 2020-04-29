import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.module.css';

function SmallPage({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        { children }
      </div>
    </div>
  );
}

SmallPage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SmallPage;
