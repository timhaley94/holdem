import React from 'react';
import PropTypes from 'prop-types';
import { AuthProvider } from './auth';
import { SocketProvider } from './socket';

function APIProvider({ children }) {
  return (
    <AuthProvider>
      <SocketProvider>
        { children }
      </SocketProvider>
    </AuthProvider>
  );
}

APIProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default APIProvider;
