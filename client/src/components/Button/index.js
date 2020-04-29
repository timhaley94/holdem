import React from 'react';
import PropTypes from 'prop-types';
import { Button as MUIButton } from '@material-ui/core';
import classNames from 'classnames';
import styles from './index.module.css';

function Button({ className, ...props }) {
  return (
    <MUIButton
      className={classNames(className, styles.container)}
      variant="contained"
      color="primary"
      {...props}
    />
  );
}

Button.propTypes = {
  className: PropTypes.string,
};

Button.defaultProps = {
  className: null,
};

export default Button;
