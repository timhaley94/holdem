import React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { useHistory } from 'react-router-dom';
import DataTable from '../DataTable';
import DataRow from '../DataRow';
import DataCell from '../DataCell';
import { useGames } from '../../state';
import styles from './index.module.css';

function Games() {
  const { push } = useHistory();
  const { games } = useGames();

  if (!games) {
    return <CircularProgress />;
  }

  if (games.length === 0) {
    return <p>Whoops a daisy</p>;
  }

  return (
    <DataTable>
      {
        games.map(
          ({ id, name, users }) => (
            <DataRow key={id} className={styles.game}>
              <DataCell className={styles.name}>
                { name }
              </DataCell>
              <DataCell align="center">
                <div className={styles.players}>
                  <p>{Object.values(users).length}</p>
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
  );
}

export default Games;
