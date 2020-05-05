import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import Errors from '../Errors';
import Game from '../Game';
import Home from '../Home';
import { useSocket } from '../../state';

function Poker() {
  const { isConnected } = useSocket();

  return (
    <>
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
    </>
  );
}

export default Poker;
