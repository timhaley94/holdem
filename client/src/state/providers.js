import React from 'react';
import PropTypes from 'prop-types';
import { UserProvider, useUserSync } from './user';
import { GamesProvider } from './games';
import { SocketProvider } from './socket';
import { ErrorProvider } from './error';

function APIProvider({ children }) {
  useUserSync();

  return (
    <GamesProvider>
      <SocketProvider>
        { children }
      </SocketProvider>
    </GamesProvider>
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
