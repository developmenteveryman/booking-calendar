export type TMatrixState = {
  items: string[];
};

export type MatrixActions =
  | { type: 'MATRIX_SET_ITEMS'; payload: string[] }
  | { type: 'MATRIX_CLEAR' };

export type MatrixActionCreators = {
  setItems: (items: string[]) => void;
  clear: () => void;
};
