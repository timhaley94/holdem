import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@material-ui/core';
import styles from './index.module.css';

function DataTable({ headers, children }) {
  return (
    <Table className={styles.container}>
      {
        headers
          ? (
            <TableHead>
              <TableRow>
                {
                  headers.map(
                    ({ name, align }) => (
                      <TableCell
                        className={styles.header}
                        align={align}
                      >
                        { name }
                      </TableCell>
                    ),
                  )
                }
              </TableRow>
            </TableHead>
          )
          : null
      }
      <TableBody>
        { children }
      </TableBody>
    </Table>
  );
}

DataTable.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.node.isRequired,
      align: PropTypes.string.isRequired,
    }),
  ),
  children: PropTypes.node.isRequired,
};

DataTable.defaultProps = {
  headers: null,
};

export default DataTable;
