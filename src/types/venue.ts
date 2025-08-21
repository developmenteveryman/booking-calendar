import type { County } from './county';
import type { ApiResponseWithData } from './common';

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

export type GetVenuesResponse = ApiResponseWithData<{ venues: Record<Venue['id'], Venue> }>;

export type GetVenueComponentsResponse = number[];
