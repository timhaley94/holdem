import React from 'react';
import { Button } from '@material-ui/core';
import classNames from 'classnames';
import styles from './index.module.css';

export default function({ className, ...props }) {
  return (
    <Button
      className={ classNames(className, styles.container) }
      { ...props }
    />
  );
}
