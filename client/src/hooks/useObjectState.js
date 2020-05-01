import { useCallback, useReducer } from 'react';

const SET = 'set';
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

  return [state.value, set];
}
