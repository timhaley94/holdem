import React, {
  useCallback,
  useState,
  useRef,
} from 'react';
import {
  Card,
  Divider,
  TextareaAutosize,
} from '@material-ui/core';
import { useEvent } from '../../hooks';
import { useRoom } from '../../state';
import { chunkBy } from '../../utils';
import MessageGroup from '../MessageGroup';
import styles from './index.module.css';

const SHIFT_CODE = 16;
const ENTER_CODE = 13;

function Chat() {
  const { messages, sendMessage } = useRoom();
  const [value, setValue] = useState('');
  const [isShiftDown, setIsShiftDown] = useState(false);
  const bottomRef = useRef(null);

  const onKeydown = useCallback(
    (e) => {
      const { keyCode } = e;

      if (keyCode === SHIFT_CODE) {
        setIsShiftDown(true);
      }

      if (keyCode === ENTER_CODE && !isShiftDown && sendMessage) {
        e.preventDefault();

        if (value) {
          sendMessage(value);
        }

        setValue('');
        bottomRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    },
    [value, isShiftDown, setIsShiftDown, sendMessage],
  );

  const onKeyup = useCallback(
    ({ keyCode }) => {
      if (keyCode === SHIFT_CODE) {
        setIsShiftDown(false);
      }
    },
    [setIsShiftDown],
  );

  useEvent('keydown', onKeydown);
  useEvent('keyup', onKeyup);

  function onBlur() {
    setIsShiftDown(false);
  }

  function onChange(e) {
    setValue(e.target.value);
  }

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
