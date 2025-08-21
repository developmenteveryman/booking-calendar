import { type FC, type MouseEventHandler, useCallback, useState } from 'react';
import './eventTable.css';
// import EventModal from '../EventModal';
import EventTimesTable from '../EventTimesTable';
import useEventRows from '../../hooks/useEventRows';
import type { EventRow } from '../../types/event';
import type { Nullable } from '../../types/common';
import useApi from '../../hooks/useApi';
import Desktop from './Desktop';
import Mobile from './Mobile';

type EventTableProps = {
    commodityId: string;
    uuid: string;
};

export type TableProps = {
    events: EventRow[];
    actions: {
        onViewEvent: MouseEventHandler<HTMLButtonElement>; // With JSON stringified data-event on button.
        onSelectEvent: MouseEventHandler<HTMLButtonElement>; // With JSON stringified data-event on button.
    };
};

const EventTable: FC<EventTableProps> = ({ uuid }) => {
    const { api } = useApi({ uuid });
    const { events } = useEventRows({ uuid });
    // const [viewMore, setViewMore] = useState<EventRow | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Nullable<EventRow>>(null);
    // const [showModal, setShowModal] = useState(false);

    const handleView = useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
        e.preventDefault();
        const event = JSON.parse(e.currentTarget.dataset.event as string) as EventRow;
        globalThis.showVenue(event.venueid);
        // setViewMore(event);
        // setShowModal(true);
    }, []);

    const handleSelect = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            e.preventDefault();
            const event = JSON.parse(e.currentTarget.dataset.event as string) as EventRow;
            setSelectedEvent(event);
            api?.selectVenue(event.venueid);
            api?.changedDate({ date: new Date(event.date * 1000) }, event.date);
        },
        [api],
    );

    const handleBackToEvents = useCallback<React.MouseEventHandler<HTMLButtonElement>>(() => {
        setSelectedEvent(null);
    }, []);

    if (selectedEvent) {
        return (
            <EventTimesTable
                selectedEvent={selectedEvent}
                uuid={uuid}
                onBackToEvents={handleBackToEvents}
            />
        );
    }
    return (
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

            {/* Event Modal */}
            {/* <EventModal event={viewMore} show={showModal} onHide={() => setShowModal(false)} /> */}
        </>
    );
};

export default EventTable;
