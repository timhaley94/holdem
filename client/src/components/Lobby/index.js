import React from 'react';
import {
  Card,
  Switch,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@material-ui/core';
import { useAPI } from '../../models';
import { Avatar } from '..';
import styles from './index.module.css';

function Lobby() {
  const {
    game,
    playerId,
    setReady
  } = useAPI();

  return (
    <Card className={ styles.container }>
      <div>
        HI
      </div>
      <div className={ styles.playersContainer }>
        <Table className={ styles.players }>
          <TableHead>
            <TableRow>
              <TableCell className={ styles.header }>Player</TableCell>
              <TableCell
                className={ styles.header }
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
                  player => (
                    <TableRow
                      key={ player.playerId }
                      className={ styles.player }
                    >
                      <TableCell className={ styles.cell }>
                        <div className={ styles.playerInfo }>
                          <Avatar playerId={ player.playerId } />
                          <p className={ styles.name }>
                            { player.data.name }
                          </p>
                        </div>
                      </TableCell>
                      <TableCell align="right" className={ styles.cell }>
                        <Switch
                          checked={ player.isReady }
                          onChange={
                            playerId === player.playerId
                              ? () => setReady(!player.isReady)
                              : null
                          }
                        />
                      </TableCell>
                    </TableRow>
                  )
                )
                : null
            }
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default Lobby;
