import type { ApiResponseWithData, Nullable } from './common';
import type { SelectableCar, SelectionRequired } from './component';

export type Event = {
    date: number;
    venueid: number;
    venuedescription: string;
    venuedateid: string;
    venuetown?: Nullable<string>;
    venuecounty?: Nullable<string>;
    venuelink: string;
    start_time: number;
};

export type EventRow = Omit<Event, 'date' | 'start_time' | 'venuecounty' | 'venuetown'> & {
    date: number;
    dateString: string; // Formatted date string
    venuelocation: string; // Formatted venue location
    venuestart: string; // Formatted start time string
};

export type GetEventList = ApiResponseWithData<{ events: Record<Event['venuedateid'], Event> }>;

export type GetEventComponentsResponse = {
    status: 'success' | 'error';
    components: SelectableCar[];
    selectionsRequired: SelectionRequired[];
};

export type ExpireReservationResponse = {
    status: 'success' | 'error';
    message: string;
    ids: number[];
};
