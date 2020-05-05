import React, { useState, useRef } from 'react';
import {
  Card,
  Divider,
  TextareaAutosize,
} from '@material-ui/core';
import { useEnterPress } from '../../hooks';
import { useSocket } from '../../state';
import { chunkBy } from '../../utils';
import MessageGroup from '../MessageGroup';
import styles from './index.module.css';

function Chat() {
  const { messages, sendMessage } = useSocket();
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const bottomRef = useRef(null);

  function onFocus() {
    setFocused(true);
  }

  function onBlur() {
    setFocused(false);
  }

  function onChange(e) {
    setValue(e.target.value);
  }

  useEnterPress((e) => {
    if (focused && value) {
      e.preventDefault();
      sendMessage(value);
      setValue('');
      bottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [focused, value, setValue, sendMessage]);

  return (
    <Card className={styles.container}>
      <div className={styles.messageContainer}>
        {
          chunkBy(messages, (m) => m.playerId)
            .map(
              ({ key, entries }) => (
                <MessageGroup
                  key={key}
                  playerId={key}
                  messages={entries}
                />
              ),
            )
        }
        <div ref={bottomRef} />
      </div>
      <Divider className={styles.divider} />
      <div className={styles.inputContainer}>
        <TextareaAutosize
          className={styles.input}
          autoComplete="off"
          autoFocus
          name="message"
          onFocus={onFocus}
          onBlur={onBlur}
          value={value}
          onChange={onChange}
          placeholder="Start chatting..."
        />
      </div>
    </Card>
  );
}

export default Chat;
