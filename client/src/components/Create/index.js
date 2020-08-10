import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CircularProgress,
  Fade,
  FormControl,
  FormControlLabel,
  Modal,
  Switch,
} from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useHistory } from 'react-router-dom';
import getRoomName from '../../utils/getRoomName';
import { Games } from '../../api';
import Button from '../Button';
import styles from './index.module.css';

function Create({ open, onClose }) {
  const [name, setName] = useState(getRoomName());
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { push } = useHistory();

  const onNameChange = () => setName(getRoomName());
  const onIsPrivateChange = () => setIsPrivate(!isPrivate);

  const onSubmit = async () => {
    setIsCreating(true);
    const { data: { id } } = await Games.create({ name, isPrivate });
    push(`/game/${id}`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={styles.container}
    >
      <Fade in={open}>
        <Card className={styles.content}>
          <div className={styles.header}>
            <div className={styles.nameContainer}>
              <p className={styles.nameLabel}>Room:</p>
              <h2 className={styles.name}>{name}</h2>
            </div>
            <AutorenewIcon
              className={styles.nameIcon}
              onClick={onNameChange}
            />
          </div>
          <FormControl className={styles.form}>
            <FormControlLabel
              className={styles.switch}
              label="Private?"
              labelPlacement="start"
              control={(
                <Switch
                  checked={isPrivate}
                  onChange={onIsPrivateChange}
                />
              )}
            />
            <div className={styles.buttonContainer}>
              <Button
                className={styles.button}
                disabled={!name || isCreating}
                onClick={onSubmit}
                size="large"
              >
                Create
                { isCreating ? <CircularProgress /> : null }
              </Button>
            </div>
          </FormControl>
        </Card>
      </Fade>
    </Modal>
  );
}

Create.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

Create.defaultProps = {
  open: false,
};

export default Create;
