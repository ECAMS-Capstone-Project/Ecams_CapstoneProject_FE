/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { get, patch } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { FieldDTO } from "./RequestClubAPI";

export enum ClubStatusEnum {
    Inactive = 0,
    Active = 1,
    Pending = 2,
    // ... tùy chỉnh thêm
}

export interface ClubMemberDTO {
    avatar: string,
    clubRoleName: string,
    email: string,
    fullname: string,
    studentId: string,
    userId: string,
}

export interface ClubResponseDTO {
    clubId: string;
    clubName: string;
    logoUrl: string;
    description: string;
    purpose: string;
    foundingDate: string;
    contactEmail?: string;
    contactPhone?: string;
    websiteUrl?: string;
    status: ClubStatusEnum;
    clubFields: FieldDTO[];
    clubMembers?: ClubMemberDTO[];
}

export const GetAllClubsAPI = async (userId: string, status: string, pageNo: number): Promise<ResponseDTO<ResponseData<ClubResponseDTO>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<ClubResponseDTO>>>(`/Clubs/User/${userId}?Status=${status}&PageNumber=${pageNo}&PageSize=8`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const GetInvitationClubsAPI = async (userId: string, pageNo: number): Promise<ResponseDTO<ResponseData<ClubResponseDTO>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<ClubResponseDTO>>>(`/Clubs/User/${userId}/invitation?PageNumber=${pageNo}&PageSize=8`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const ApproveClubAPI = async (clubId: string, userId: string): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>(`/Clubs/${clubId}/User/${userId}/accept`);
        return response; // Trả về toàn bộ phản hồi
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

export const DenyClubAPI = async (clubId: string, userId: string, stu: any): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>(`/Clubs/${clubId}/User/${userId}/reject`, stu);
        return response; // Trả về toàn bộ phản hồi
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

export const GetProcessClubsAPI = async (universityId: string, pageNo: number): Promise<ResponseDTO<ResponseData<ClubResponseDTO>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<ClubResponseDTO>>>(`/Clubs/university/${universityId}?Status=PROCESSING&PageNumber=${pageNo}&PageSize=8`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const DenyClubCheckingAPI = async (clubId: string, stu: any): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>(`/Clubs/${clubId}/reject`, stu);
        return response; // Trả về toàn bộ phản hồi
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

export const ApproveClubCheckingAPI = async (clubId: string): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>(`/Clubs/${clubId}/accept`);
        return response; // Trả về toàn bộ phản hồi
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