import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {
  Header,
  Footer,
  Home,
  Game
} from '..';
import { ModelProvider } from '../../model';
import './index.css';

function App() {
  return (
    <ModelProvider>
      <Router>
        <Header />
        <Switch>
          <Route path="/game">
            <Game />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </ModelProvider>
  );
}

export default App;
