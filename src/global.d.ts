import type React from 'react';
import type { MatrixAvailability } from './types/matrix';
import type { EventRow } from './types/event';
import type { Nullable } from './types/common';

declare global {
    // Exposed by BookingCalendar components
    var bookingCalendar: Record<
        string,
        {
            eventsTable: {
                setSelectedEvent: React.Dispatch<React.SetStateAction<Nullable<EventRow>>>;
            };
        }
    >;

    // Expected by BookingCalendar components
    var moment: typeof import('moment');
    var matrixAvailabilityInstances: Record<string, MatrixAvailability> | undefined;
    var clearVenue: (
        element: object,
        toDates?: boolean,
        uuid?: string | null,
        container?: object | null,
    ) => void;
    var clearComponents: () => void;
    var createPopupContainer: () => void;
    var showComponent: (id: string | number) => void;
    var showVenue: (id: string | number) => void;
    var showWooMatrixShortcode: (shortcode: string) => void;
}

export {};
