import type { FC } from 'react';
import type { TableProps } from '.';

const Desktop: FC<TableProps> = ({ events, actions }) => {
    const { onViewEvent, onSelectEvent } = actions;

    return (
        <div className="booking-calendar_table-responsive d-none d-md-block">
            <table className="table table-sm table-striped booking-calendar_table-bordered text-center booking-calendar_table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Event Details</th>
                        <th>Location</th>
                        <th>Start Time</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, index) => (
                        <tr key={index}>
                            <td className="align-middle">{event.dateString}</td>
                            <td className="align-middle">{event.venuedescription}</td>
                            <td className="align-middle">{event.venuelocation}</td>
                            <td className="align-middle">{event.venuestart}</td>
                            <td className="align-middle">
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Desktop;
