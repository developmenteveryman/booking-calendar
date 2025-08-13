import { createContext } from 'preact';
import { useReducer, useMemo } from 'preact/hooks';
import type { TMatrixState, MatrixActions, MatrixActionCreators } from './matrixTypes';

const MatrixStateContext = createContext<TMatrixState | undefined>(undefined);
const MatrixActionsContext = createContext<MatrixActionCreators | undefined>(undefined);

const initialState: TMatrixState = { items: [] };

function reducer(state: TMatrixState, action: MatrixActions): TMatrixState {
  switch (action.type) {
    case 'MATRIX_SET_ITEMS':
      return { ...state, items: action.payload };
    case 'MATRIX_CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export const MatrixProvider = ({ children }: { children: preact.ComponentChildren }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo<MatrixActionCreators>(
    () => ({
      setItems: (items) => dispatch({ type: 'MATRIX_SET_ITEMS', payload: items }),
      clear: () => dispatch({ type: 'MATRIX_CLEAR' }),
    }),
    [],
  );

  return (
    <MatrixStateContext.Provider value={state}>
      <MatrixActionsContext.Provider value={actions}>{children}</MatrixActionsContext.Provider>
    </MatrixStateContext.Provider>
  );
};

export { MatrixStateContext, MatrixActionsContext };
