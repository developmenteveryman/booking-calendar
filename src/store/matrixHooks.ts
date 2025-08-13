import { useContext } from 'preact/hooks';
import { MatrixStateContext, MatrixActionsContext } from './MatrixProvider';
import type { TMatrixState, MatrixActionCreators } from './matrixTypes';

export function useMatrixState(): TMatrixState {
  const context = useContext(MatrixStateContext);
  if (!context) throw new Error('useMatrixState must be used within a MatrixProvider');
  return context;
}

export function useMatrixActions(): MatrixActionCreators {
  const context = useContext(MatrixActionsContext);
  if (!context) throw new Error('useMatrixActions must be used within a MatrixProvider');
  return context;
}

export function useMatrixStore(): [TMatrixState, MatrixActionCreators] {
  return [useMatrixState(), useMatrixActions()];
}
