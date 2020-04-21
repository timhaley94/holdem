import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Drawer, Input } from '@material-ui/core';
import { useMetadata } from '../../models';
import { AvatarPicker } from '..';
import styles from './index.module.css';

function Sidebar({ requireData }) {
  const [metadata, setMetadata] = useMetadata();
  const [isOpen, setIsOpen] = useState(false);

  const [newName, setNewName] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);

  const storedName = (
    metadata
      && metadata.hasOwnProperty('name')
      ? metadata.name
      : null
  );

  const storedAvatar = (
    metadata
      && metadata.hasOwnProperty('avatarId')
      ? metadata.avatarId
      : null
  );

  const name = (
    newName === null
      ? storedName
      : newName
  );

  const avatar = (
    newAvatar === null
      ? storedAvatar
      : newAvatar
  );

  console.log(
    newName,
    newAvatar,
    storedName,
    storedAvatar,
    name,
    avatar
  );

  const isStored = storedName !== null && storedAvatar !== null;
  const isValid = name !== null && avatar !== null;

  const onNameChange = ({ target: { value } }) => setNewName(value);
  const onAvatarChange = value => setNewAvatar(value);

  const onSubmit = () => {
    setMetadata({
      name: name,
      avatarId: avatar
    })

    setIsOpen(false);
  };

  return (
    <>
      {
        isStored
          ? (
            <div
              className={ styles.icon }
              onClick={ () => setIsOpen(true) }
            >
              { storedName }
            </div>
          )
          : null
      }
      <Drawer
        anchor="right"
        open={ isOpen || (requireData && !isStored) }
        onClose={ () => setIsOpen(false) }
      >
        <div className={ styles.sidebar }>
          <Input
            value={ name || '' }
            onChange={ onNameChange }
          />
          <AvatarPicker
            value={ avatar }
            onChange={ onAvatarChange }
          />
          <Button
            size="large"
            variant="contained"
            disabled={ !isValid }
            onClick={ onSubmit }
          >
            Submit
          </Button>
        </div>
      </Drawer>
    </>
  );
}

Sidebar.propTypes = {
  requireData: PropTypes.bool
};

Sidebar.defaultProps = {
  requireData: false
};

export default Sidebar;
