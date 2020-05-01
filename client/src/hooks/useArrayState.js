import { useCallback, useReducer } from 'react';

const PUSH = 'push';
const PULL = 'pull';

const initialState = { value: [] };

function reducer(state, action) {
  switch (action.type) {
    case PUSH:
      return {
        ...state,
        value: [
          ...state.value,
          action.value,
        ],
      };
    case PULL:
      return {
        ...state,
        value: state.value.filter(
          (x) => !action.fn(x),
        ),
      };
    default:
      return state;
  }
}

export default function useArrayState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const push = useCallback(
    (value) => dispatch({
      type: PUSH,
      value,
    }),
    [dispatch],
  );

  const pull = useCallback(
    (fn) => dispatch({
      type: PULL,
      fn,
    }),
    [dispatch],
  );

  return [state.value, push, pull];
}
