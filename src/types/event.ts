import type { ApiResponseWithData, Nullable } from "@/types/common";

export type Event = {
    date: number;
    venueid: number;
    venuedescription: string;
    venuedateid: string;
    percentageremaining: number;
    percentageused: number;
    status: Nullable<string>;
    upgrade: number;
};

export type GetEventList = ApiResponseWithData<{ events: Record<Event['venuedateid'], Event> }>;