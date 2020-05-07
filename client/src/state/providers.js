import React from 'react';
import PropTypes from 'prop-types';
import { UserProvider, useUserSync } from './user';
import { SocketProvider } from './socket';
import { GamesProvider } from './games';
import { GameProvider } from './game';
import { ErrorProvider } from './error';

function APIProvider({ children }) {
  useUserSync();

  return (
    <SocketProvider>
      <GamesProvider>
        <GameProvider>
          { children }
        </GameProvider>
      </GamesProvider>
    </SocketProvider>
  );
}

APIProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function StateProvider({ children }) {
  return (
    <UserProvider>
      <ErrorProvider>
        { children }
      </ErrorProvider>
    </UserProvider>
  );
}

StateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export {
  APIProvider,
  StateProvider,
};
