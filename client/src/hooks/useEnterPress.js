import { useCallback, useState } from 'react';
import useEvent from './useEvent';

const SHIFT_CODE = 16;
const ENTER_CODE = 13;

export default function useEnterPress(fn) {
  const [isShiftDown, setIsShiftDown] = useState(false);

  const onKeydown = useCallback(
    (e) => {
      const { keyCode } = e;

      if (keyCode === SHIFT_CODE) {
        setIsShiftDown(true);
      }

      if (keyCode === ENTER_CODE && !isShiftDown) {
        fn(e);
      }
    },
    [fn, isShiftDown, setIsShiftDown],
  );

  const onKeyup = useCallback(
    ({ keyCode }) => {
      if (keyCode === SHIFT_CODE) {
        setIsShiftDown(false);
      }
    },
    [setIsShiftDown],
  );

  useEvent('keydown', onKeydown);
  useEvent('keyup', onKeyup);
}
