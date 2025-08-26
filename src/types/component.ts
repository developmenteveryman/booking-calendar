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
    componentStartTime: number;
    componentEndTime: number;
    componentTimeStatus: 'full' | 'alreadyBooked' | 'available';
    supplement?: string; // e.g. '£16.67'
};

export type ComponentTypeStatus = ComponentTime['componentTimeStatus'] | 'selected';

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
    supplement?: string; // e.g. '£16.67'
    componentTimes: ComponentTime[];
};
