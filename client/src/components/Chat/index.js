import React, { useState, useRef } from 'react';
import {
  Card,
  Divider,
  TextareaAutosize
} from '@material-ui/core';
import { useAPI, useEnterPress } from '../../models';
import { chunkBy } from '../../utils';
import { MessageGroup } from '..';
import styles from './index.module.css';

function Chat() {
  const { messages, sendMessage } = useAPI();
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const bottomRef = useRef(null);

  function onFocus() {
    setFocused(true);
  }

  function onBlur() {
    setFocused(false);
  }

  function onChange({ target: { value } }) {
    setValue(value);
  }

  useEnterPress(e => {
    if (focused && value) {
      e.preventDefault();
      sendMessage(value);
      setValue('');
      bottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [focused, value, setValue, sendMessage]);

  return (
    <Card className={ styles.container }>
      <div className={ styles.messageContainer }>
        {
          chunkBy(messages, m => m.playerId)
            .map(
              ({ key, entries }) => (
                <MessageGroup
                  key={ key }
                  playerId={ key }
                  messages={ entries }
                />
              )
            )
        }
        <div ref={ bottomRef } />
      </div>
      <Divider className={ styles.divider } />
      <div className={ styles.inputContainer }>
        <TextareaAutosize
          className={ styles.input }
          autoComplete="off"
          autoFocus
          name="message"
          onFocus={ onFocus }
          onBlur={ onBlur }
          value={ value }
          onChange={ onChange }
        />
      </div>
    </Card>
  );
}

export default Chat;