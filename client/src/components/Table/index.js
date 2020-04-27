import React from 'react';
import { Card } from '@material-ui/core';
import styles from './index.module.css';

function Table() {
  return (
    <Card className={ styles.container }>
      <p>Hi from table</p>
    </Card>
  );
}

export default Table;
