import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { StateProvider, APIProvider } from '../../state';
import About from '../About';
import Boundary from '../Boundary';
import Header from '../Header';
import Fatal from '../Fatal';
import Footer from '../Footer';
import Poker from '../Poker';
import Sidebar from '../Sidebar';
import styles from './index.module.css';
import './index.css';

function App() {
  return (
    <StateProvider>
      <div className={styles.container}>
        <Router>
          <Header />
          <Sidebar />
          <main className={styles.content}>
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/error">
                <Fatal />
              </Route>
              <Route>
                <Boundary>
                  <APIProvider>
                    <Poker />
                  </APIProvider>
                </Boundary>
              </Route>
            </Switch>
          </main>
          <Footer />
        </Router>
      </div>
    </StateProvider>
  );
}

export default App;
