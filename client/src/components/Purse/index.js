import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './index.module.css';

function Purse({
  amount: target,
  noColor,
  size,
  theme,
}) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => {
        if (v === null || v === target) {
          clearInterval(id);
          return target;
        }

        const step = Math.max(
          Math.floor(Math.abs(v - target) / 4),
          1,
        );

        if (v < target) {
          return v + step;
        }

        return v - step;
      });
    }, 25);

    return () => clearInterval(id);
  }, [target, setValue]);

  const colors = (
    noColor
      ? {
        [styles.green]: target > value,
        [styles.red]: target < value,
      }
      : null
  );

  if (!value && value !== 0) {
    return null;
  }

  return (
    <div
      className={
        classNames(
          styles.container,
          styles[size],
          styles[theme],
        )
      }
    >
      <span className={styles.dollarSignContainer}>
        <span className={styles.dollarSign}>
          $
        </span>
      </span>
      <p
        className={
          classNames(
            styles.text,
            colors,
          )
        }
      >
        { value.toLocaleString() }
      </p>
    </div>
  );
}

Purse.propTypes = {
  amount: PropTypes.number.isRequired,
  noColor: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large']),
  theme: PropTypes.oneOf(['light', 'dark']),
};

Purse.defaultProps = {
  noColor: false,
  size: 'small',
  theme: 'light',
};

export default Purse;
