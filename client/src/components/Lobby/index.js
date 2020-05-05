import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  Card,
  Switch,
  TextField,
} from '@material-ui/core';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { useSocket } from '../../state';
import Avatar from '../Avatar';
import Button from '../Button';
import DataTable from '../DataTable';
import DataRow from '../DataRow';
import DataCell from '../DataCell';
import styles from './index.module.css';

function Lobby() {
  const [isCopied, setIsCopied] = useState(false);
  const copyRef = useRef(null);
  const { push } = useHistory();
  const { pathname } = useLocation();

  const {
    game,
    playerId,
    setReady,
  } = useSocket();

  useEffect(() => {
    if (game && game.isStarted) {
      push(`${pathname}/table`);
    }
  }, [game, push, pathname]);

  const { href } = window.location;

  const onSelect = () => copyRef.current.select();
  const onCopy = () => {
    onSelect();
    document.execCommand('copy');
    setIsCopied(true);
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
              game
                && game.players
                ? Object.values(game.players).map(
                  (player) => (
                    <DataRow key={player.playerId}>
                      <DataCell>
                        <div className={styles.playerInfo}>
                          <Avatar playerId={player.playerId} />
                          <p className={styles.name}>
                            { player.data.name }
                          </p>
                        </div>
                      </DataCell>
                      <DataCell align="right">
                        <Switch
                          checked={player.isReady}
                          onChange={
                            playerId === player.playerId
                              ? () => setReady(!player.isReady)
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
