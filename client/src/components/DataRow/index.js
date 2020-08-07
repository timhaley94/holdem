import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './index.module.css';

function DataRow({ isHeader, className, children }) {
  const classes = classNames(className, styles.container);
  return (
    <tr className={classes}>
      { children }
    </tr>
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
