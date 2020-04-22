import React from 'react';
import styles from './index.module.css';

function SmallPage({ children }) {
  return (
    <div className={ styles.container }>
      <div className={ styles.content }>
        { children }
      </div>
    </div>
  );
}

export default SmallPage;
