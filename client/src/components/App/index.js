import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
}from 'react-router-dom';
import { Provider, APIProvider } from '../../models';
import {
  About,
  Header,
  Fatal,
  Footer,
  Poker,
  Sidebar
} from '..';
import styles from './index.module.css';
import './index.css';

function App() {
  return (
    <Provider>
      <div className={ styles.container }>
        <Router>
          <Header />
          <Sidebar />
          <main className={ styles.content }>
            <Switch>
              <Route path="/about">
                <About />
              </Route>
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
    </Provider>
  );
}

export default App;
