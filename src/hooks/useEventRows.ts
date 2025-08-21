import { useCallback, useEffect, useState } from 'react';
import type { EventRow } from '../types/event';
import useApi from './useApi';
import debounce from '../utils/debounce';

type HookArguments = {
    uuid: string;
};

type HookReturn = {
    events: EventRow[];
    isLoading: boolean;
    loadEvents: () => Promise<void>;
};

export default function useEventRows({ uuid }: HookArguments): HookReturn {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { api } = useApi({ uuid });

    const [events, setEvents] = useState<EventRow[]>([]);

    const loadEvents = useCallback(async () => {
        if (!api) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await api.getEventsList().then((data) => {
                return Object.values(data).map<EventRow>((event) => ({
                    date: event.date,
                    dateString: moment.unix(event.date).format('DD MMM YYYY'),
                    venueid: event.venueid,
                    venuedescription: event.venuedescription,
                    venuedateid: event.venuedateid,
                    venuelocation: [event.venuetown, event.venuecounty].filter(Boolean).join(', '),
                    venuestart: event.start_time
                        ? moment.unix(event.start_time).format('HH:mm')
                        : '',
                    venuelink: event.venuelink,
                }));
            });
            setEvents(response);
            setIsLoading(false);
        } catch (error) {
            console.warn('Error loading events:', error);
            setIsLoading(false);
        }
    }, [api]);

    useEffect(() => {
        const debouncedLoader = debounce(loadEvents, 500);
        debouncedLoader();
        return () => {
            debouncedLoader.cancel();
        };
    }, [loadEvents]);

    console.log(api);

    return { events, loadEvents, isLoading };
}
