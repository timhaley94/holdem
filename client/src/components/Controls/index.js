import React from 'react';
import { Card } from '@material-ui/core';
import Button from '../Button';
import styles from './index.module.css';

function Controls() {
  return (
    <Card className={ styles.container }>
      <Button className={ styles.button }>Raise</Button>
      <Button className={ styles.button }>Check</Button>
    </Card>
  );
}

export default Controls;
