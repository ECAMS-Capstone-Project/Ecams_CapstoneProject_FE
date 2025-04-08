// ResponseDTO.ts

import { StatusCodeEnum } from "@/lib/statusCodeEnum";

export interface ResponseDTO<T> {
    statusCode: StatusCodeEnum;
    message: string;
    data?: T;
}

export interface ResponseData<T> {
    currentPage: number;
    data: Array<T>;
    hasNext: boolean;
    hasPrevious: boolean
    pageSize:number;
    totalCount: number;
    totalPages: number;
}