import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  Redirect,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import { useAPI } from '../../models';
import { Chat, Lobby, Table } from '..';
import styles from './index.module.css';

function Game() {
  const match = useRouteMatch();
  const { game, joinGame } = useAPI();
  let { id } = useParams();

  useEffect(() => {
    if (!game) {
      joinGame(id);
    }
  }, [game, id, joinGame]);

  return (
    <div className={ styles.container }>
      <Chat />
      <Switch>
        <Route exact path={ match.path }>
          <Lobby />
        </Route>
        <Route path={ `${match.path}/table` }>
          <Table />
        </Route>
        <Route>
          <Redirect to={ match.path } />
        </Route>
      </Switch>
    </div>
  );
}

export default Game;
