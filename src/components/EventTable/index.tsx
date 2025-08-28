import { type FC, type MouseEventHandler, useCallback, useEffect, useState } from 'react';
import './eventTable.css';
import EventTimesTable from '../EventTimesTable';
import useEventRows from '../../hooks/useEventRows';
import type { EventRow } from '../../types/event';
import type { Nullable } from '../../types/common';
import useApi from '../../hooks/useApi';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { EventTimesTableProvider } from '../../providers/EventTimesTable';

type EventTableProps = {
    commodityId: string;
    reservationId?: string;
    uuid: string;
};

export type TableProps = {
    events: EventRow[];
    actions: {
        onViewEvent: MouseEventHandler<HTMLButtonElement>; // With JSON stringified data-event on button.
        onSelectEvent: MouseEventHandler<HTMLButtonElement>; // With JSON stringified data-event on button.
    };
};

const EventTable: FC<EventTableProps> = ({ commodityId, uuid, ...rest }) => {
    const { api } = useApi({ uuid });
    const { events, isLoading } = useEventRows({ uuid });
    const [selectedEvent, setSelectedEvent] = useState<Nullable<EventRow>>(null);
    const [reservationId, setReservationId] = useState<Nullable<string>>(
        rest.reservationId && rest.reservationId !== '' ? rest.reservationId : null,
    );

    const handleView = useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
        e.preventDefault();
        const event = JSON.parse(e.currentTarget.dataset.event as string) as EventRow;
        globalThis.showVenue(event.venueid);
    }, []);

    const handleSelect = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            e.preventDefault();
            const event = JSON.parse(e.currentTarget.dataset.event as string) as EventRow;
            setSelectedEvent(event);
            api?.selectEvent(event.venueid, event.date - moment().utcOffset() * 60);
        },
        [api],
    );

    const handleBackToEvents = useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => {
        setSelectedEvent(null);
    }, []);

    const handleCancelReservation = useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => {
        if (reservationId && api) {
            api.amendReservation(Number(commodityId), Number(reservationId));
        }
    }, [api, commodityId, reservationId]);

    /**
     *  Effect used to:
     *      - Expose the API for the event table.
     */
    useEffect(() => {
        const existingExposedApi = globalThis.bookingCalendar?.[uuid];
        if (!existingExposedApi) {
            globalThis.bookingCalendar = { [uuid]: { eventsTable: { setSelectedEvent } } };
            return;
        }
        globalThis.bookingCalendar[uuid].eventsTable = {
            setSelectedEvent,
        };

        return () => {
            delete globalThis.bookingCalendar[uuid];
        };
    }, []);

    if (reservationId) {
        return (
            <>
                <div className="alert alert-info">
                    Must cancel existing reservation before amend:
                    <button className="btn btn-link mt-0" onClick={handleCancelReservation}>
                        Cancel Reservation
                    </button>
                </div>
            </>
        );
    }

    if (selectedEvent) {
        return (
            <EventTimesTableProvider uuid={uuid}>
                <EventTimesTable
                    selectedEvent={selectedEvent}
                    uuid={uuid}
                    onBackToEvents={handleBackToEvents}
                />
            </EventTimesTableProvider>
        );
    }

    return (
        <>
            {isLoading ? (
                <div className="alert alert-info">Loading data, please wait...</div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <Desktop
                        events={events}
                        actions={{
                            onViewEvent: handleView,
                            onSelectEvent: handleSelect,
                        }}
                    />

                    {/* Mobile Cards */}
                    <Mobile
                        events={events}
                        actions={{
                            onViewEvent: handleView,
                            onSelectEvent: handleSelect,
                        }}
                    />
                </>
            )}
        </>
    );
};

export default EventTable;
