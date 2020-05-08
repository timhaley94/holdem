import React from 'react';
import {
  Button,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { useHistory } from 'react-router-dom';
import DataTable from '../DataTable';
import DataRow from '../DataRow';
import DataCell from '../DataCell';
import Whoops from '../Whoops';
import { useGames } from '../../state';
import styles from './index.module.css';

function Games() {
  const { push } = useHistory();
  const { games } = useGames();

  if (!games) {
    return <CircularProgress />;
  }

  if (games.length === 0) {
    return (
      <>
        <Whoops />
        <p>No games yet...</p>
      </>
    );
  }

  return (
    <div className={styles.container}>
      <Divider />
      <DataTable>
        {
          games.map(
            ({ id, name, userCount }) => (
              <DataRow key={id} className={styles.game}>
                <DataCell className={styles.name}>
                  { name }
                </DataCell>
                <DataCell align="center">
                  <div className={styles.players}>
                    <p>{userCount}</p>
                    <PersonIcon className={styles.icons} />
                  </div>
                </DataCell>
                <DataCell align="right">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => push(`/game/${id}`)}
                  >
                    Join!
                  </Button>
                </DataCell>
              </DataRow>
            ),
          )
        }
      </DataTable>
    </div>
  );
}

export default Games;
