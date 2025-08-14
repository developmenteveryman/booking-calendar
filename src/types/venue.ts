import type { County } from "@/types/county";
import type { ApiResponseWithData } from "@/types/common";

export type Venue = {
    id: number;
    description: string;
    town: string;
    county: County;
    postcode: string;
    latitude: number;
    longitude: number;
    image: boolean;
};

export type GetVenuesResponse = ApiResponseWithData<{venues: Record<Venue['id'], Venue>}>;

export type GetVenueComponentsResponse = number[];