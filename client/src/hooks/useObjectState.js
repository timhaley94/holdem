import { useCallback, useReducer } from 'react';

const SET = 'set';
const UNSET = 'unset';
const initialState = { value: {} };

function reducer(state, action) {
  switch (action.type) {
    case SET:
      return {
        ...state,
        value: {
          ...state.value,
          ...action.value,
        },
      };
    case UNSET:
      const copy = { ...state.value };
      delete copy[action.key];

      return {
        ...state,
        value: copy,
      };
    default:
      return state;
  }
}

export default function useObjectState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const set = useCallback(
    (value) => dispatch({
      type: SET,
      value,
    }),
    [dispatch],
  );

  const unset = useCallback(
    (key) => dispatch({
      type: UNSET,
      key,
    }),
    [dispatch],
  );

  return [state.value, set, unset];
}
