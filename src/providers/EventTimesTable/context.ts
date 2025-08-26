import { createContext, useContext } from 'react';
import type { AppliedSelection } from '../../types/reservation';

export type State = { uuid: string; appliedSelection: AppliedSelection };

export type Action =
    | { type: 'reset'; uuid: string }
    | { type: 'set-appliedselections'; payload: AppliedSelection };

const EventTimesTableContext = createContext<
    | {
          state: State;
          actions: {
              setAppliedSelection: (
                  update: AppliedSelection | ((prev: AppliedSelection) => AppliedSelection),
              ) => AppliedSelection;
          };
      }
    | undefined
>(undefined);

export function useEventTimesTableContext() {
    const context = useContext(EventTimesTableContext);
    if (!context)
        throw new Error('useEventTimesTableContext must be used within EventTimesTableProvider');
    return context;
}

export default EventTimesTableContext;
