import React, { useReducer } from 'react';
import type { Action, State } from './context';
import EventTimesTableContext from './context';
import type { AppliedSelection } from '../../types/reservation';

const initialState = (uuid: string): State => ({ uuid, appliedSelection: {} });

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'reset':
            return { uuid: action.uuid, appliedSelection: {} };
        case 'set-appliedselections':
            console.log(action.payload);
            return { ...state, appliedSelection: action.payload };
        default:
            return state;
    }
}

function setAppliedSelection(state: State, dispatch: React.Dispatch<Action>) {
    return (update: AppliedSelection | ((prev: AppliedSelection) => AppliedSelection)) => {
        if (typeof update === 'function') {
            const updated = update(state.appliedSelection);
            dispatch({ type: 'set-appliedselections', payload: updated });
            return updated;
        } else {
            dispatch({ type: 'set-appliedselections', payload: update });
            return update;
        }
    };
}

export const EventTimesTableProvider: React.FC<{ uuid: string; children: React.ReactNode }> = ({
    uuid,
    children,
}) => {
    const [state, dispatch] = useReducer(reducer, uuid, initialState);

    const actions = {
        setAppliedSelection: setAppliedSelection(state, dispatch),
    };

    return (
        <EventTimesTableContext.Provider value={{ state, actions }}>
            {children}
        </EventTimesTableContext.Provider>
    );
};
