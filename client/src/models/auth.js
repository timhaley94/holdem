import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { post } from 'axios';
import { v4 as uuid } from 'uuid';
import {
  useAsyncEffect,
  useStoredState,
} from '../hooks';
import config from '../config';

const Context = createContext(null);
const STORAGE_KEY = 'auth-data';
const route = `${config.serverUrl}/api/users`;

async function create(secret) {
  const { data } = await post(
    `${route}`,
    { secret },
  );

  return data;
}

async function auth(id, secret) {
  const { data } = await post(
    `${route}/auth`,
    { id, secret },
  );

  return data;
}

function AuthProvider({ children }) {
  const [data, setData] = useStoredState(STORAGE_KEY, {});
  const [token, setToken] = useState(null);

  useAsyncEffect(async (isValid) => {
    if (!token) {
      let nextToken = null;
      let nextData = null;

      if (data.id && data.secret) {
        const res = await auth(
          data.id,
          data.secret,
        );

        nextToken = res.token;
      } else {
        const secret = uuid();
        const res = await create(secret);

        nextToken = res.token;
        nextData = { id: res.id, secret };
      }

      if (isValid()) {
        if (nextToken) {
          setToken(nextToken);
        }

        if (nextData) {
          setData(nextData);
        }
      }
    }
  }, [data, token, setToken, setData]);

  return (
    <Context.Provider value={{ ...data, token }}>
      { children }
    </Context.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useAuth() {
  return useContext(Context);
}

export {
  AuthProvider,
  useAuth,
};
