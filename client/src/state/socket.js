import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import config from '../config';
import { useUser } from './user';

const Context = createContext(null);

function SocketProvider({ children }) {
  const { push } = useHistory();
  const [{ token }] = useUser();

  // Socket State
  const [_socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const reset = useCallback(() => {
    setIsConnected(false);
    setSocket(null);
  }, [setIsConnected, setSocket]);

  const fatal = useCallback(() => {
    // Log fatal here
    reset();
    push('/error');
  }, [reset, push]);

  useEffect(() => {
    if (token) {
      const socket = io(config.serverUrl, {
        query: { token },
      });

      socket.on('connect', () => setIsConnected(true));
      socket.on('connect_error', fatal);
      socket.on('connect_timeout', fatal);
      socket.on('error', fatal);
      socket.on('disconnect', reset);

      setSocket(socket);

      return () => {
        // Must be wrapped in anonymous function because
        // of 'this' binding inside .disconnect()
        socket.disconnect();
      };
    }
  }, [token, push, reset, fatal]);

  const value = {
    socket: (
      isConnected
        && _socket
        ? _socket
        : null
    ),
  };

  return (
    <Context.Provider value={value}>
      { children }
    </Context.Provider>
  );
}

SocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useSocket() {
  return useContext(Context);
}

export {
  SocketProvider,
  useSocket,
};
