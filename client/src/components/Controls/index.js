import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import styles from './index.module.css';

function ControlButton({
  icon,
  text,
  ...rest
}) {
  return (
    <div className={styles.buttonContainer}>
      <IconButton {...rest}>
        { icon }
      </IconButton>
      <p className={styles.buttonText}>{ text }</p>
    </div>
  );
}

ControlButton.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.node.isRequired,
};

function Controls() {
  return (
    <div className={styles.container}>
      <ControlButton
        icon={<ArrowUpwardIcon />}
        text="Raise"
      />
      <ControlButton
        icon={<CheckIcon />}
        text="Check"
      />
      <ControlButton
        icon={<CloseIcon />}
        text="fold"
      />
    </div>
  );
}

export default Controls;
