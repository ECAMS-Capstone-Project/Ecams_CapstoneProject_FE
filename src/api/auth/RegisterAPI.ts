// AuthService.ts

import { ResponseDTO } from "../BaseResponse";
import { post } from "../agent";
import { RepresentativeRegisterRequest } from "@/models/Auth/RepresentativeRegister";
import axiosMultipartForm from "../axiosMultipartForm";
import toast from "react-hot-toast";
/* eslint-disable @typescript-eslint/no-explicit-any */

export const registerRepresentativeAPI = async (data: RepresentativeRegisterRequest): Promise<ResponseDTO<string>> => {
    try {
        const response = await post<ResponseDTO<string>>("/Auth/sign-up-representative", data);
        return response;
    } catch (error: any) {
        if (error.response) {
            console.error("API Error:", error.response.data);
            toast.error(error.response.data.message || "API Error");
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            toast.error("Network error. Please try again later");
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const registerStudentAPI = async (formData: FormData): Promise<ResponseDTO<string>> => {
    try {
        const response = await axiosMultipartForm.post("/Auth/sign-up-student", formData);
        const apiResponse = response.data as ResponseDTO<string>;
        return apiResponse;
    } catch (error: any) {
        if (error.response) {
            console.error("API Error:", error.response.data);
            toast.error(error.response.data.message || "API Error");
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            toast.error("Network error. Please try again later");
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const additionInfoUniversityAPI = async (formData: FormData): Promise<ResponseDTO<string>> => {
    try {
        const response = await axiosMultipartForm.post("/Universities", formData);
        const apiResponse = response.data as ResponseDTO<string>;
        return apiResponse;
    } catch (error: any) {
        if (error.response) {
            console.error("API Error:", error.response.data);
            toast.error(error.response.data.message || "API Error");
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            toast.error("Network error. Please try again later");
            throw new Error("Network error. Please try again later.");
        }
    }
};