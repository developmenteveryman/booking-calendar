import type { ComponentTime, SelectableCar } from './component';
import type { Event, GetEventComponentsResponse } from './event';

export type MatrixAvailability = {
    initialise: (
        sourceElement: any,
        availabilityContainer: any,
        uuid: string,
        originalCommodityId: any,
        appliedSelections?: any,
        venueId?: any,
        date?: any,
    ) => void;
    selectEvent: (venueId: number, timestamp: number) => void;
    venueOptions: (dateRanges?: any) => void;
    applySelections: (selections: any, delayRefresh?: boolean) => void;
    dateAvailability: (date: any) => string | false;
    changedDate: (e: { date: Date }, date?: number) => void;
    changedPeriod: (e: { date: Date }) => boolean;
    amendReservation: (commodityId: number, reservationId: number) => void;
    confirmReservation: (
        carIds: SelectableCar['componentId'][],
        timeIds: ComponentTime['componentTimeId'][],
        dateStamp: number,
        timestamp: number,
        timezoneOffset?: number,
        onFinish?: (data: any) => void,
    ) => Promise<boolean>;
    getEventsList: () => Promise<Record<number | string, Event>>;
    getEventComponents: (venueDateId: number) => Promise<GetEventComponentsResponse>;
    getComponentsTimes: (venueDateId: number) => Promise<any>;
    selectVenue: (venueId: number, filterVenue?: any, delayRefresh?: boolean, date?: Date) => void;
    drawTimes: (times: any) => void;
    selectTime: (timeId: any, element: any) => void;
    reservation: (reservations: any) => void;
    scrollTo: (element: any, alignment?: string) => void;
    toggleUpgrades: (element?: any) => void;

    that: MatrixAvailability;
    availableDates: any;
    availableVenues: any;
    availableTimes: any;
    isModal: boolean;
    requiresParticipants: boolean;
    selectedCommodity: any;
    originalCommodity: any;
    appliedSelections: any;
    selectedDate: any;
    filteredVenue: any;
    selectedVenue: any;
    selectedTime: any;
    initialScrollOffset: any;
    uuid: any;
    participants: any;
    allowUpgrades: boolean;
};
