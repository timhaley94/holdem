import React from 'react';
// import {
//   FormControlLabel,
//   Radio,
//   RadioGroup
// } from '@material-ui/core';
import classNames from 'classnames';
import styles from './index.module.css';

const AVATAR_IDS = [...Array(9)].map((x, i) => i);

function AvatarPicker({ value, onChange }) {
  return (
    <div className={ styles.container }>
      {
        AVATAR_IDS.map(id => {
          const classes = classNames(styles.option, {
            [styles.active]: value === id
          });

          return (
            <div
              key={ id }
              className={ classes }
              onClick={ () => onChange(id) }
            />
          );
        })
      }
    </div>
  );
  // return (
  //   <RadioGroup
  //     value={ value }
  //     onChange={ onChange }
  //   >
  //     {
  //       AVATAR_IDS.map(id => (
  //         <FormControlLabel
  //           value="1"
  //           control={<Radio />}
  //           label="1"
  //         />
  //       ))
  //     }
  //   </RadioGroup>
  // );
}

export default AvatarPicker;
