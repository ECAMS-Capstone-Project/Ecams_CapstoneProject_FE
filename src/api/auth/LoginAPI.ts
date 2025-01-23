// AuthService.ts

import { LoginRequest, LoginResponseDTO, RefreshTokenRequestDTO, RefreshTokenResponseDTO } from "@/models/Auth/LoginRequest";
import { ResponseDTO } from "../BaseResponse";
import { get, post } from "../agent";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import toast from "react-hot-toast";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const loginAPI = async (data: LoginRequest): Promise<ResponseDTO<LoginResponseDTO>> => {
    try {
        const response = await post<ResponseDTO<LoginResponseDTO>>("/Auth/login", data);
        return response;
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const getCurrentUserAPI = async (): Promise<ResponseDTO<UserAuthDTO>> => {
    try {
        const response = await get<ResponseDTO<UserAuthDTO>>("/Auth/me");
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

export const refreshTokenAPI = async (data: RefreshTokenRequestDTO): Promise<ResponseDTO<RefreshTokenResponseDTO>> => {
    try {
        const response = await post<ResponseDTO<RefreshTokenResponseDTO>>("/Auth/refresh-token", data);
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