import {
  useCallback,
  useState,
} from 'react';

function getItem(key) {
  return JSON.parse(
    localStorage.getItem(key),
  );
}

function setItem(key, value) {
  localStorage.setItem(
    key,
    JSON.stringify(value),
  );
}

export default function useStoredState(key, defaultValue) {
  const [value, _setValue] = useState(() => {
    const storedData = getItem(key);
    return storedData || defaultValue;
  });

  const setValue = useCallback((data) => {
    const next = {
      ...value,
      ...data,
    };

    _setValue(next);
    setItem(key, next);
  }, [key, value]);

  return [
    value || defaultValue,
    setValue,
  ];
}
