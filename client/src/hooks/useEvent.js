import { useEffect } from 'react';

export default function useEvent(name, fn) {
  useEffect(() => {
    const handler = (e) => fn(e);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [name, fn]);
}
