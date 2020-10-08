import React, {
  useState,
  useRef,
} from 'react';
import {
  Card,
  Switch,
  TextField,
} from '@material-ui/core';
import {
  useUser,
  useRoom,
  usePlayers,
} from '../../state';
import Avatar from '../Avatar';
import Button from '../Button';
import DataTable from '../DataTable';
import DataRow from '../DataRow';
import DataCell from '../DataCell';
import styles from './index.module.css';

function Lobby() {
  const [isCopied, setIsCopied] = useState(false);
  const copyRef = useRef(null);

  const [{ id: userId }] = useUser();
  const { setReady } = useRoom();
  const { players } = usePlayers();

  const { href } = window.location;

  const onSelect = () => copyRef.current.select();
  const onCopy = () => {
    onSelect();
    document.execCommand('copy');
    setIsCopied(true);
  };

  const userName = (id) => {
    const player = players.find((p) => p.id === id);
    return player && player.name ? player.name : null;
  };

  return (
    <Card className={styles.container}>
      <div className={styles.content}>
        <p className={styles.prompt}>
          Send to your friends...
        </p>
        <div className={styles.link}>
          <TextField
            className={styles.linkInput}
            inputRef={copyRef}
            variant="filled"
            value={href}
            onFocus={onSelect}
            autoComplete="off"
            InputProps={{ disableUnderline: true }}
          />
          <Button
            className={styles.linkButton}
            variant="contained"
            color="primary"
            size="small"
            disableElevation
            onClick={onCopy}
          >
            { isCopied ? 'Copied!' : 'Copy' }
          </Button>
        </div>
        <div className={styles.playersContainer}>
          <DataTable
            headers={[
              { name: 'Player' },
              { name: 'Ready?', align: 'right' },
            ]}
          >
            {
              players.length > 0
                ? players.map(
                  ({ id, isReady }) => (
                    <DataRow key={id}>
                      <DataCell>
                        <div className={styles.playerInfo}>
                          <Avatar userId={id} />
                          <p className={styles.name}>
                            { userName(id) }
                          </p>
                        </div>
                      </DataCell>
                      <DataCell align="right">
                        <Switch
                          checked={isReady}
                          onChange={
                            id === userId
                              ? () => setReady(!isReady)
                              : null
                          }
                        />
                      </DataCell>
                    </DataRow>
                  ),
                )
                : null
            }
          </DataTable>
        </div>
      </div>
    </Card>
  );
}

export default Lobby;
