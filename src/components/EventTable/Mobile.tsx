import type { FC } from 'react';
import type { TableProps } from '.';

const Mobile: FC<TableProps> = ({ events, actions }) => {
    const { onViewEvent, onSelectEvent } = actions;

    return (
        <div className="d-md-none">
            {events.map((event, index) => (
                <div key={index} className="mobile-event-card">
                    <h5 className="mobile-event-title">{event.venuedescription}</h5>
                    <div className="mobile-event-details">
                        <div>
                            <strong>Date:</strong> {event.dateString}
                        </div>
                        <div>
                            <strong>Location:</strong> {event.venuelocation}
                        </div>
                        <div>
                            <strong>Start Time:</strong> {event.venuestart}
                        </div>
                        <div className="mobile-event-buttons">
                            <button
                                className="btn booking-calendar_btn-secondary mr-2 mt-0"
                                data-toggle="modal"
                                data-target="#eventModal"
                                data-event={JSON.stringify(event)}
                                onClick={onViewEvent}
                            >
                                View
                            </button>
                            <button
                                data-event={JSON.stringify(event)}
                                className="btn booking-calendar_btn-success mt-0"
                                onClick={onSelectEvent}
                            >
                                Select
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Mobile;
