import { useReducer } from 'react';
import type { AppliedSelection } from '../types/reservation';

type HookArguments = { uuid: string };

type State = {
    uuid: string;
    appliedSelection: AppliedSelection;
};

type HookReturn = {
    state: State;
    setAppliedSelection: React.Dispatch<React.SetStateAction<AppliedSelection>>;
};

type Action = { type: 'reset'; uuid: string } | { type: 'set'; payload: AppliedSelection };

const initialState = (uuid: string): State => ({ uuid, appliedSelection: {} });

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'reset':
            return { uuid: action.uuid, appliedSelection: {} };
        case 'set':
            return {
                ...state,
                appliedSelection: {
                    ...state.appliedSelection,
                    ...action.payload,
                },
            };
        default:
            return state;
    }
}

export default function useAppliedSelection({ uuid }: HookArguments): HookReturn {
    const [state, dispatch] = useReducer(reducer, uuid, initialState);

    // Reset state if uuid changes
    console.log(state.uuid, uuid);
    if (state.uuid !== uuid) {
        dispatch({ type: 'reset', uuid });
    }

    const setAppliedSelection = (
        update: AppliedSelection | ((prev: AppliedSelection) => AppliedSelection),
    ) => {
        if (typeof update === 'function') {
            const updated = update(state.appliedSelection);
            dispatch({ type: 'set', payload: updated });
            return updated;
        } else {
            dispatch({ type: 'set', payload: update });
            return update;
        }
    };

    return {
        state,
        setAppliedSelection,
    };
}
