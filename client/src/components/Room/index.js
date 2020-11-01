import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { useRoom } from '../../state';
import Chat from '../Chat';
import Lobby from '../Lobby';
import Page from '../Page';
import Game from '../Game';

function Room() {
  const { room, join } = useRoom();
  const { id } = useParams();

  useEffect(() => {
    if (!room && join) {
      join(id);
    }
  }, [room, id, join]);

  return (
    <Page>
      {
        !room
          ? <CircularProgress />
          : (
            <>
              <Chat />
              {
                room && room.gameId
                  ? <Game />
                  : <Lobby />
              }
            </>
          )
      }
    </Page>
  );
}

export default Room;
