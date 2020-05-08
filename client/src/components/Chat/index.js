import React, { useState, useRef } from 'react';
import {
  Card,
  Divider,
  TextareaAutosize,
} from '@material-ui/core';
import { useEnterPress } from '../../hooks';
import { useGame } from '../../state';
import { chunkBy } from '../../utils';
import MessageGroup from '../MessageGroup';
import styles from './index.module.css';

function Chat() {
  const { messages, sendMessage } = useGame();
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
    if (focused && value && sendMessage) {
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
          chunkBy(messages, (m) => m.userId)
            .map(
              ({ key, entries }) => (
                <MessageGroup
                  key={key}
                  userId={key}
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
