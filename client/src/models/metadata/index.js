import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

const Context = createContext(null);
const STORAGE_KEY = 'user-data';

function MetadataProvider({ children }) {
  const [value, _setValue] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem(STORAGE_KEY),
    );

    if (storedData) {
      _setValue(storedData);
    }
  }, []);

  function setValue(data) {
    const next = {
      ...value,
      ...data,
    };

    _setValue(next);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next),
    );
  }

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
