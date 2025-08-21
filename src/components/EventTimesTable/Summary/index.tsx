import type { FC, MouseEventHandler } from 'react';
import type { EventRow } from '../../../types/event';
import type { Nullable } from '../../../types/common';
import type { SelectableCar, SelectionRequired } from '../../../types/component';

type SummaryProps = {
    selectedEvent: Nullable<EventRow>;
    selectionRequired: SelectionRequired[];
    eventCars: SelectableCar[];
    selectedCarIds: number[];
    actions: {
        onBackToEvents: MouseEventHandler<HTMLButtonElement>;
        onRemoveVenue: MouseEventHandler<HTMLButtonElement>;
        onRemoveCar: MouseEventHandler<HTMLButtonElement>;
    };
};

const Summary: FC<SummaryProps> = ({
    eventCars,
    selectionRequired,
    selectedEvent,
    selectedCarIds,
    actions,
}) => {
    const { onBackToEvents, onRemoveVenue, onRemoveCar } = actions;
    return (
        <div className="mb-3 mt-3 p-3 booking-calendar_selection-summary">
            {selectedEvent && (
                <div className="mb-2 d-flex justify-content-between align-items-center">
                    <div>
                        <strong>You have selected the following venue:</strong>{' '}
                        {selectedEvent.venuedescription}
                    </div>
                    <div>
                        <button
                            className="btn btn-sm btn-outline-secondary mt-0 mr-1"
                            onClick={onBackToEvents}
                            style={{ width: '64px' }}
                        >
                            ← Back
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger mt-0"
                            onClick={onRemoveVenue}
                            style={{ width: '64px' }}
                        >
                            ↺ Clear
                        </button>
                    </div>
                </div>
            )}

            {selectionRequired.map((selection) => {
                const availableCars = eventCars.filter((car) =>
                    car.componentPosition?.includes(selection.position),
                );
                const selectedCars = selectedCarIds
                    .map((id) => availableCars.find((car) => car.componentId === id))
                    .filter(Boolean);

                return (
                    <div key={selection.index} className="d-flex flex-column text-left mb-2">
                        <strong>
                            {selection.name}{' '}
                            <small className="text-muted ml-2">
                                ({availableCars.length} car{availableCars.length > 1 ? 's' : ''}{' '}
                                available)
                            </small>
                        </strong>

                        <ul className="list-unstyled mb-0">
                            {selectedCars.length > 0 &&
                                selectedCars.map((car) => (
                                    <li
                                        key={car?.componentId}
                                        className="d-flex justify-content-between align-items-center mb-1"
                                    >
                                        <span>{car?.websiteTitle}</span>
                                        <button
                                            data-carid={car?.componentId}
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={onRemoveCar}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default Summary;
