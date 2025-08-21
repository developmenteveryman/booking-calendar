import type { SelectableCar, SelectionRequired } from './component';

export type AppliedSelection = Record<SelectionRequired['index'], SelectableCar['componentId'][]>;
