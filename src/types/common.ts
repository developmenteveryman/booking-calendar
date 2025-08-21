export type ApiResponseWithData<T> = {
    status: 'success' | 'error';
    message: string;
    count: number;
} & T;

export type FalseOr<T> = false | T;

export type Nullable<T> = T | null;
