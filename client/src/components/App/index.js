import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { StateProvider, APIProvider } from '../../state';
import About from '../About';
import Boundary from '../Boundary';
import Fatal from '../Fatal';
import Footer from '../Footer';
import Poker from '../Poker';
import Sidebar from '../Sidebar';
import styles from './index.module.css';
import Background from './Background2.jpg';
import './index.css';

function App() {
  return (
    <StateProvider>
      <Router>
        <Sidebar />
        <main
          className={styles.container}
          style={{ backgroundImage: `url(${Background})` }}
        >
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
    </StateProvider>
  );
}

export default App;
