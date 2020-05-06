import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from '@material-ui/core';
import classNames from 'classnames';
import styles from './index.module.css';

function DataCell({ className, children, ...props }) {
  const classes = classNames(className, styles.container);
  return (
    <TableCell className={classes} {...props}>
      { children }
    </TableCell>
  );
}

DataCell.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

DataCell.defaultProps = {
  className: null,
};

export default DataCell;
