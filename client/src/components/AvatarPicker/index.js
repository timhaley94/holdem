import React from 'react';
import {
  FormControlLabel,
  Radio,
  RadioGroup
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import avatars from '../../data/avatars';
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
          avatars.map(({ id, color }) => (
            <FormControlLabel
              className={ styles.label }
              key={ id }
              value={ id }
              control={
                <Radio
                  className={ styles.option }
                  style={{ backgroundColor: color }}
                  icon={ <span /> }
                  checkedIcon={ <CheckIcon /> }
                />
              }
            />
          ))
        }
      </div>
    </RadioGroup>
  );
}

export default AvatarPicker;
