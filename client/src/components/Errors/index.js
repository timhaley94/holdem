import React, {
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@material-ui/lab';
import { Collapse } from '@material-ui/core';
import { useSocket } from '../../models';
import styles from './index.module.css';

function Error({ id, message }) {
  const { dismissError } = useSocket();

  const onDismiss = useCallback(
    () => dismissError(id),
    [dismissError, id],
  );

  useEffect(() => {
    const timer = setTimeout(onDismiss, 20000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <Collapse in>
      <Alert
        className={styles.error}
        variant="filled"
        severity="error"
        onClose={onDismiss}
      >
        { message }
      </Alert>
    </Collapse>
  );
}

Error.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

function Errors() {
  const { errors } = useSocket();

  return (
    <div className={styles.container}>
      {
        errors.map(
          (error) => (
            <Error
              {...error}
              key={error.id}
            />
          ),
        )
      }
    </div>
  );
}

export default Errors;
