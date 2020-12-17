import React from 'react';
import PropTypes from 'prop-types';
import { UserProvider, useUserSync } from './user';
import { ErrorProvider } from './error';
import { SocketProvider } from './socket';
import { RoomsProvider } from './rooms';
import { RoomProvider } from './room';
import { PlayersProvider } from './players';
import { GameProvider } from './game';
import { RoundProvider } from './round';

function apply(components, children) {
  return components.reverse().reduce(
    (acc, C) => <C>{ acc }</C>,
    children,
  );
}

function APIProvider({ children }) {
  useUserSync();

  const providers = [
    SocketProvider,
    RoomsProvider,
    RoomProvider,
    PlayersProvider,
    GameProvider,
    RoundProvider,
  ];

  return apply(providers, children);
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
