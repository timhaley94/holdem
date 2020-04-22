import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import {
  Boundary,
  Game,
  Home,
  Progress,
  Sidebar
} from '..';
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
          ? <Progress />
          : (
            <Switch>
              <Route exact path="/">
                <Home />
                <Sidebar />
              </Route>
              <Route path={ `/game/:id` }>
                <Game />
                <Sidebar requireData />
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
