import React from 'react';
import PropTypes from 'prop-types';
import { TableRow } from '@material-ui/core';
import classNames from 'classnames';
import styles from './index.module.css';

function DataRow({ className, children }) {
  const classes = classNames(className, styles.container);
  return (
    <TableRow className={classes}>
      { children }
    </TableRow>
  );
}

DataRow.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

DataRow.defaultProps = {
  className: null,
};

export default DataRow;
