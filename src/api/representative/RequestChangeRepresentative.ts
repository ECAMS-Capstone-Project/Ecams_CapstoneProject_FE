/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { get, post, put } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";

interface RepresentativeInfo {
    email: string;
}

interface University {
    universityId: string;
    representativeInfo: RepresentativeInfo;
}

interface UniversityUpdate {
    type: string;
    updateInfo: RepresentativeInfo;
}

export interface GetRepresentativeHistoryDTO {
    userId: string;
    fullname: string;
    email: string;
    avatar: string;
    gender: "MALE" | "FEMALE";
    phoneNumber: string;
    status: "ACTIVE" | "INACTIVE" | "PENDING";
    startDate: string | null;
    endDate: string | null;
}

export const CreateRequestChangeRepresentativeAPI = async (universityId: string, data: University): Promise<ResponseDTO<string>> => {
    try {
        const response = await post<ResponseDTO<string>>(`/Universities/${universityId}/representative/changes`, data);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 404) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            toast.error(error.response.data.message);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const GetHistoryChangeRepresentativeAPI = async (universityId: string, params: URLSearchParams): Promise<ResponseDTO<ResponseData<GetRepresentativeHistoryDTO>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<GetRepresentativeHistoryDTO>>>(`Universities/${universityId}/representative/changes?${params.toString()}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const RepresentativeChangeInfo = async (universityId: string, data: UniversityUpdate): Promise<ResponseDTO<string>> => {
    try {
        const response = await put<ResponseDTO<string>>(`/Universities/${universityId}/representative/changes`, data);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 404) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            toast.error(error.response.data.message);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};