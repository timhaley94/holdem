import React from 'react';
import {
  FormControlLabel,
  Radio,
  RadioGroup
} from '@material-ui/core';
import { avatars } from '../../models';
import styles from './index.module.css';

function AvatarPicker({ value, onChange }) {
  return (
    <RadioGroup
      name="avatar"
      value={ value }
      onChange={ ({ target: { value } }) => onChange(value) }
    >
      <div className={ styles.container }>
        {
          avatars.map(({ id, image }) => {
            const img = (
              <img
                alt="dog-icon"
                src={ image }
                width={ 100 }
                height={ 100 }
              />
            );

            return (
              <FormControlLabel
                className={ styles.label }
                key={ id }
                value={ id }
                control={
                  <Radio
                    className={ styles.option }
                    icon={ img }
                    checkedIcon={ img }
                  />
                }
              />
            )
          })
        }
      </div>
    </RadioGroup>
  );
}

export default AvatarPicker;
