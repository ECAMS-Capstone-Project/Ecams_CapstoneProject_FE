// ResponseDTO.ts

import { StatusCodeEnum } from "@/lib/statusCodeEnum";

export interface ResponseDTO<T> {
    statusCode: StatusCodeEnum;
    message: string;
    data?: T;
}
