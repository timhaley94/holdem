import { useCallback, useReducer } from 'react';

const PUSH = 'push';
const PULL = 'pull';
const SET = 'set';

const initialState = { value: [] };

function reducer(state, action) {
  switch (action.type) {
    case PUSH:
      return {
        ...state,
        value: [
          ...state.value,
          ...(
            Array.isArray(action.value)
              ? action.value
              : [action.value]
          ),
        ],
      };
    case PULL:
      return {
        ...state,
        value: state.value.filter(
          (x) => !action.fn(x),
        ),
      };
    case SET:
      return {
        ...state,
        value: action.value,
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

  const set = useCallback(
    (value) => dispatch({
      type: SET,
      value,
    }),
    [dispatch],
  );

  return [state.value, push, pull, set];
}
