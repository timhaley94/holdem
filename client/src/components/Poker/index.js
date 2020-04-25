import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Boundary, Game, Home } from '..';
import { useAPI } from '../../models';

function Poker() {
  const {
    isConnected,
    error,
    dismissError
  } = useAPI();

  return (
    <Boundary>
      {
        error
          ? (
            <Alert
              variant="filled"
              severity="error"
              onClose={ dismissError }
            >
              { error }
            </Alert>
          )
          : null
      }
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
