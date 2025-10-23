export interface IResponseBase {
    isSuccess: boolean;
    errors: string[];
}

export interface IResponse<T> extends IResponseBase {
    data: T;
}

