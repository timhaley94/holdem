import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  Card,
  Switch,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TextField,
} from '@material-ui/core';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { useSocket } from '../../models';
import Avatar from '../Avatar';
import Button from '../Button';
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
          <Table className={styles.players}>
            <TableHead>
              <TableRow>
                <TableCell className={styles.header}>Player</TableCell>
                <TableCell
                  className={styles.header}
                  align="right"
                >
                  Ready?
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                game
                  && game.players
                  ? Object.values(game.players).map(
                    (player) => (
                      <TableRow
                        key={player.playerId}
                        className={styles.player}
                      >
                        <TableCell className={styles.cell}>
                          <div className={styles.playerInfo}>
                            <Avatar playerId={player.playerId} />
                            <p className={styles.name}>
                              { player.data.name }
                            </p>
                          </div>
                        </TableCell>
                        <TableCell align="right" className={styles.cell}>
                          <Switch
                            checked={player.isReady}
                            onChange={
                              playerId === player.playerId
                                ? () => setReady(!player.isReady)
                                : null
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ),
                  )
                  : null
              }
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}

export default Lobby;
