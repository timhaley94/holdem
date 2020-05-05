import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from '@material-ui/core';
import styles from './index.module.css';

function DataCell({ children, ...props }) {
  return (
    <TableCell className={styles.container} {...props}>
      { children }
    </TableCell>
  );
}

DataCell.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DataCell;
