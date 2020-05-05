import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  Redirect,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { useSocket } from '../../state';
import Chat from '../Chat';
import Lobby from '../Lobby';
import Page from '../Page';
import Table from '../Table';

function Game() {
  const match = useRouteMatch();
  const { game, joinGame } = useSocket();
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
              <Switch>
                <Route exact path={match.path}>
                  <Lobby />
                </Route>
                <Route path={`${match.path}/table`}>
                  <Table />
                </Route>
                <Route>
                  <Redirect to={match.path} />
                </Route>
              </Switch>
            </>
          )
      }
    </Page>
  );
}

export default Game;
