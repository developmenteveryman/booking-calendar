import type { MatrixAvailability } from '@/types/matrix';

declare global {
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
