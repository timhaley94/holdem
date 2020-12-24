import React from 'react';
import Purse from '../Purse';
import styles from './index.module.css';

function Pot() {
  return (
    <div className={styles.container}>
      <Purse
        amount={0}
        noColor
        size="large"
        theme="dark"
      />
    </div>
  );
}

export default Pot;
