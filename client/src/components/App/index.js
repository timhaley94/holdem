import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
}from 'react-router-dom';
import { APIProvider, MetadataProvider } from '../../models';
import {
  // Header,
  Fatal,
  Footer,
  Poker
} from '..';
import styles from './index.module.css';
import './index.css';

function App() {
  return (
    <MetadataProvider>
      <div className={ styles.container }>
        <Router>
          { /* <Header /> */ }
          <main className={ styles.content }>
            <Switch>
              <Route path="/error">
                <Fatal />
              </Route>
              <Route>
                <APIProvider>
                  <Poker />
                </APIProvider>
              </Route>
            </Switch>
          </main>
          <Footer />
        </Router>
      </div>
    </MetadataProvider>
  );
}

export default App;
