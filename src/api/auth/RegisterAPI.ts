// AuthService.ts

import { ResponseDTO } from "../BaseResponse";
import { post } from "../agent";
import { StaffRegisterRequest } from "@/models/Auth/StaffRegister";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const registerStaffAPI = async (data: StaffRegisterRequest): Promise<ResponseDTO<string>> => {
    try {
        const response = await post<ResponseDTO<string>>("/Auth/sign-up-staff", data);
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
