import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './index.module.css';

function DataCell({
  isHeader,
  className,
  children,
  ...props
}) {
  const classes = classNames(className, styles.container);

  if (isHeader) {
    return (
      <th className={classes} {...props}>
        { children }
      </th>
    );
  }

  return (
    <td className={classes} {...props}>
      { children }
    </td>
  );
}

DataCell.propTypes = {
  isHeader: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

DataCell.defaultProps = {
  isHeader: false,
  className: null,
};

export default DataCell;
