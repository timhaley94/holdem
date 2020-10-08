import React from 'react';
import {
  Button,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { useHistory } from 'react-router-dom';
import { useRooms } from '../../state';
import DataTable from '../DataTable';
import DataRow from '../DataRow';
import DataCell from '../DataCell';
import Whoops from '../Whoops';
import styles from './index.module.css';

function Rooms() {
  const { push } = useHistory();
  const { rooms } = useRooms();

  if (!rooms) {
    return <CircularProgress />;
  }

  if (rooms.length === 0) {
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
          rooms.map(
            ({ _id: id, name, players }) => (
              <DataRow key={id} className={styles.room}>
                <DataCell className={styles.name}>
                  { name }
                </DataCell>
                <DataCell align="center">
                  <div className={styles.players}>
                    <p>{players.length}</p>
                    <PersonIcon className={styles.icons} />
                  </div>
                </DataCell>
                <DataCell align="right">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => push(`/room/${id}`)}
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

export default Rooms;
