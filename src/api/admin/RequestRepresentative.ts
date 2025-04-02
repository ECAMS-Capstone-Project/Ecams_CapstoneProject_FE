/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { get, patch } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";

interface RepresentativeInfo {
    fullname: string;
    email: string;
    phoneNumber: string;
    avatar?: string;
}

export interface RepChangeRequest {
    universityId: string;
    universityName: string;
    universityAddress: string;
    status: string;
    shortName: string;
    contactEmail: string;
    contactPhone: string;
    logoLink: string;
    requesterInfo: RepresentativeInfo;
    requestedPersonInfo: RepresentativeInfo;
}

export const GetAllRequestByRepresentativeAPI = async (search: string, statusFilter: string, currentPage: number, ITEMS_PER_PAGE: number): Promise<ResponseDTO<ResponseData<RepChangeRequest>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<RepChangeRequest>>>(`/Universities/representative/changes?Search=${search}&Status=${statusFilter}&PageNumber=${currentPage}&PageSize=${ITEMS_PER_PAGE}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const AcceptRepresentativeRequestAPI = async (universityId: string): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>(`/Universities/${universityId}/representative/changes`);
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
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};