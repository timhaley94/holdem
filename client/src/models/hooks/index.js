import {
  useEffect,
  useState
} from 'react';

const SHIFT_CODE = 16;
const ENTER_CODE = 13;

export function useEnterPress(fn) {
  const [isShiftDown, setIsShiftDown] = useState(false);

  useEffect(() => {
    const handler = e => {
      if (e.keyCode === SHIFT_CODE) {
        setIsShiftDown(true);
      }

      if (e.keyCode === ENTER_CODE && !isShiftDown) {
        fn(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fn, isShiftDown, setIsShiftDown]);

  useEffect(() => {
    const handler = e => {
      if (e.keyCode === SHIFT_CODE) {
        setIsShiftDown(false);
      }
    };

    window.addEventListener('keyup', handler);
    return () => window.removeEventListener('keyup', handler);
  }, [setIsShiftDown]);
}
