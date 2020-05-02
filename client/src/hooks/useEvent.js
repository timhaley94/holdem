import { useEffect } from 'react';

export default function useEvent(name, fn) {
  useEffect(() => {
    const handler = (e) => fn(e);
    window.addEventListener(name, handler);
    return () => window.removeEventListener(name, handler);
  }, [name, fn]);
}
