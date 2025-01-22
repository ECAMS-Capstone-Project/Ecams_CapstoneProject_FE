import { ConfirmEmailRequest, ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest } from "@/models/Auth/VerifyModel";
import { ResponseDTO } from "../BaseResponse";
import { patch, post } from "../agent";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const VerifyEmailAPI = async (data: VerifyEmailRequest): Promise<ResponseDTO<string>> => {
    try {
        const response = await post<ResponseDTO<string>>("/Auth/verify-email", data);
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

export const ConfirmEmailAPI = async (data: ConfirmEmailRequest): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>("/Auth/confirm-email", data);
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

export const ForgotPasswordAPI = async (data: ForgotPasswordRequest): Promise<ResponseDTO<string>> => {
    try {
        const response = await post<ResponseDTO<string>>("/Auth/forgot-pass", data);
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

export const ResetPasswordAPI = async (data: ResetPasswordRequest): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>("/Auth/reset-pass", data);
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