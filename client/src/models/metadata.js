import React, {
  createContext,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useStoredState } from '../hooks';

const Context = createContext(null);
const STORAGE_KEY = 'user-data';

function MetadataProvider({ children }) {
  const [value, setValue] = useStoredState(STORAGE_KEY);

  return (
    <Context.Provider value={{ value, setValue }}>
      { children }
    </Context.Provider>
  );
}

MetadataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useMetadata() {
  const { value, setValue } = useContext(Context);
  return [value, setValue];
}

export {
  MetadataProvider,
  useMetadata,
};
