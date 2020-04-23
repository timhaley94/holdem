import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

const Context = createContext(null);
const STORAGE_KEY = 'user-data';

export function MetadataProvider({ children }) {
  const [value, _setValue] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    if (storedData) {
      _setValue(storedData);
    }
  }, []);

  function setValue(data) {
    const next = {
      ...value,
      ...data
    };

    _setValue(next);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next)
    );
  }

  return (
    <Context.Provider value={{ value, setValue }}>
      { children }
    </Context.Provider>
  );
}

export function useMetadata() {
  const { value, setValue } = useContext(Context);
  return [value, setValue];
}
