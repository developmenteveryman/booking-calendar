import type { SelectableCar, SelectionRequired } from './component';

export type AppliedSelection = Record<
    SelectionRequired['index'],
    {
        carIds: SelectableCar['componentId'][];
        timeIds: SelectableCar['componentTimes'][0]['componentTimeId'][];
    }
>;
