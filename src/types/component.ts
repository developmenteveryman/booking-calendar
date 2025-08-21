import type { FalseOr, Nullable } from './common';

export type Component = {
    description: string;
    websiteTitle: Nullable<string>;
    moreInformation: Nullable<string>;
    componentGroup: number;
    availabilityType: string;
    configurationMode: string;
    participantCount: number;
    sortOrder: Nullable<number>;
    internalOnly: boolean;
    active: boolean;
    image: FalseOr<string>;
};

export type ComponentTime = {
    componentTimeId: number;
    componentTime: string; // Formatted time string (e.g. '14:00 - 14:30')
    componentStartTime: string;
    componentEndTime: string;
    componentTimeStatus: 'available' | 'nearlyFull' | 'fullyBooked';
    supplement?: string; // e.g. 'Â£16.67'
};

export type SelectionRequired = {
    name: string;
    position: number;
    index: number;
};

export type SelectableCar = {
    componentId: number;
    componentPosition: number[]; // Reflects all possible positions for this component, linked to SelectionRequired type
    description: string;
    websiteTitle: string;
    image: string;
    supplement?: string; // e.g. 'Â£16.67'
    componentTimes: ComponentTime[];
};
// export type GetComponentResponse = {
//     status: 'success' | 'error';
//     message: string;
//     venueid: string;
//     details: Component;
// };

// export type GetCommodityComponentsResponse = {
//     fixed: Array<SelectionRequired>;
//     selectable: Array<SelectionRequired>;
// };
