import React from 'react';
import PropTypes from 'prop-types';
import { TableRow } from '@material-ui/core';
import styles from './index.module.css';

function DataRow({ children }) {
  return (
    <TableRow className={styles.container}>
      { children }
    </TableRow>
  );
}

DataRow.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DataRow;
