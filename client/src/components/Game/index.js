import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { useGame } from '../../state';
import Chat from '../Chat';
import Lobby from '../Lobby';
import Page from '../Page';
import Table from '../Table';

function Game() {
  const { game, joinGame } = useGame();
  const { id } = useParams();

  useEffect(() => {
    if (!game) {
      joinGame(id);
    }
  }, [game, id, joinGame]);

  return (
    <Page>
      {
        !game
          ? <CircularProgress />
          : (
            <>
              <Chat />
              {
                game && game.isStarted
                  ? <Table />
                  : <Lobby />
              }
            </>
          )
      }
    </Page>
  );
}

export default Game;
