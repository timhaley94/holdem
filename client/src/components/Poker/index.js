import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import Boundary from '../Boundary';
import Errors from '../Errors';
import Game from '../Game';
import Home from '../Home';
import { useAPI } from '../../models';

function Poker() {
  const { isConnected } = useAPI();

  return (
    <Boundary>
      <Errors />
      {
        !isConnected
          ? <CircularProgress />
          : (
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/game/:id">
                <Game />
              </Route>
              <Route>
                <Redirect to="/" />
              </Route>
            </Switch>
          )
      }
    </Boundary>
  );
}

export default Poker;
