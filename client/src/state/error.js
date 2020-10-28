import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const Context = createContext(null);

function log(...args) {
  // Replace this with some external log.
  console.warn(...args);
}

function ErrorProvider({ children }) {
  const [value, setValue] = useState(null);
  return (
    <Context.Provider value={{ value, setValue }}>
      { children }
    </Context.Provider>
  );
}

ErrorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useError() {
  const { push } = useHistory();
  const { value, setValue } = useContext(Context);
  return [
    value,
    (...args) => {
      log(...args);
      setValue(args[0].message);
      push('/error');
    },
  ];
}

export {
  ErrorProvider,
  useError,
};
