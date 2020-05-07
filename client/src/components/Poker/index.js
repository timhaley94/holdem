import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Errors from '../Errors';
import Game from '../Game';
import Home from '../Home';

function Poker() {
  return (
    <>
      <Errors />
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
    </>
  );
}

export default Poker;
