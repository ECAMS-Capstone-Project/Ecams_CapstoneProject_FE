// AuthService.ts

import { LoginRequest, LoginResponseDTO } from "@/models/Auth/LoginRequest";
import { ResponseDTO } from "../BaseResponse";
import { post } from "../agent";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const loginAPI = async (data: LoginRequest): Promise<ResponseDTO<LoginResponseDTO>> => {
    try {
        const response = await post<ResponseDTO<LoginResponseDTO>>("/Auth/login", data);
        return response;
    } catch (error: any) {
        if (error.response) {
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};
