import React from 'react';
import PropTypes from 'prop-types';
import { Divider } from '@material-ui/core';
import DataRow from '../DataRow';
import DataCell from '../DataCell';
import styles from './index.module.css';

function DataTable({ headers, children }) {
  return (
    <table className={styles.container}>
      {
        headers
          ? (
            <>
              <thead>
                <DataRow>
                  {
                    headers.map(
                      ({ name, align }) => (
                        <DataCell
                          key={name}
                          className={styles.header}
                          align={align || 'left'}
                          isHeader
                        >
                          { name }
                        </DataCell>
                      ),
                    )
                  }
                </DataRow>
              </thead>
              <Divider />
            </>
          )
          : null
      }
      <tbody>
        { children }
      </tbody>
    </table>
  );
}

DataTable.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.node.isRequired,
      align: PropTypes.string,
    }),
  ),
  children: PropTypes.node.isRequired,
};

DataTable.defaultProps = {
  headers: null,
};

export default DataTable;
