import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CircularProgress,
  Fade,
  FormControl,
  FormControlLabel,
  InputLabel,
  Input,
  Modal,
  Switch,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useGames } from '../../state';
import Button from '../Button';
import styles from './index.module.css';

function Create({ open, onClose }) {
  const [name, setName] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const { push } = useHistory();
  const { create, isCreating } = useGames();

  const onNameChange = ({ target: { value } }) => setName(value);
  const onIsPrivateChange = () => setIsPrivate(!isPrivate);

  const onSubmit = async () => {
    const { id } = await create({ name, isPrivate });
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
          <h2 className={styles.header}>New Game</h2>
          <FormControl className={styles.form}>
            <div className={styles.input}>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                id="name"
                placeholder="E.g. Coolest game"
                value={name || ''}
                onChange={onNameChange}
              />
            </div>
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
