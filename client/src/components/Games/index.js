import React from 'react';
import { CircularProgress } from '@material-ui/core';
import Button from '../Button';
import DataTable from '../DataTable';
import DataRow from '../DataRow';
import DataCell from '../DataCell';
import { useGames } from '../../state';

function Games() {
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
          ({ id, name }) => (
            <DataRow key={id}>
              <DataCell>
                { name }
              </DataCell>
              <DataCell>
                <Button>Join!</Button>
              </DataCell>
            </DataRow>
          ),
        )
      }
    </DataTable>
  );
}

export default Games;
