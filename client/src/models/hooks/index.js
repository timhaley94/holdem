import {
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';

const SHIFT_CODE = 16;
const ENTER_CODE = 13;

export function useEnterPress(fn) {
  const [isShiftDown, setIsShiftDown] = useState(false);

  useEffect(() => {
    const handler = (e) => {
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
    const handler = (e) => {
      if (e.keyCode === SHIFT_CODE) {
        setIsShiftDown(false);
      }
    };

    window.addEventListener('keyup', handler);
    return () => window.removeEventListener('keyup', handler);
  }, [setIsShiftDown]);
}

export function useArrayState() {
  const [s, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'push':
          return {
            ...state,
            value: [
              ...state.value,
              action.value,
            ],
          };
        case 'pull':
          return {
            ...state,
            value: state.value.filter(
              (x) => !action.fn(x),
            ),
          };
        default:
          return state;
      }
    },
    {
      value: [],
    },
  );

  const push = useCallback(
    (value) => dispatch({
      type: 'push',
      value,
    }),
    [dispatch],
  );

  const pull = useCallback(
    (fn) => dispatch({
      type: 'pull',
      fn,
    }),
    [dispatch],
  );

  return [s.value, push, pull];
}
