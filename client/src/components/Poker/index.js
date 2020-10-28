import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Errors from '../Errors';
import Room from '../Room';
import Home from '../Home';

function Poker() {
  return (
    <>
      <Errors />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/room/:id">
          <Room />
        </Route>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </>
  );
}

export default Poker;
