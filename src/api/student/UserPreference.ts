/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { get, put } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { Event } from "@/models/Event";
import { FieldDTO } from "../club-owner/RequestClubAPI";

export const UpdateUserPreferenceAPI = async (userId: string, data: { fieldIds: string[] }): Promise<ResponseDTO<string>> => {
    try {
        const response = await put<ResponseDTO<string>>(`/Students/User/${userId}/favorite`, data);
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

export const GetRecommendedEventsAPI = async (
    userId: string,
    pageNumber: number,
    pageSize: number,
    type: string = "PUBLIC"
): Promise<ResponseDTO<ResponseData<Event>>> => {
    try {
        const url = `/Event/User/${userId}/recommendation?Type=${type}&PageNumber=${pageNumber}&PageSize=${pageSize}`;
        const response = await get<ResponseDTO<ResponseData<Event>>>(url);
        return response;
    } catch (error) {
        console.error("Error fetching recommended events:", error);
        throw error;
    }
};

export const GetUserFavoriteAPI = async (userId: string): Promise<ResponseDTO<FieldDTO[]>> => {
    try {
        const response = await get<ResponseDTO<FieldDTO[]>>(`Students/User/${userId}/favorite`);
        return response;
    } catch (error) {
        console.error("Error fetching recommended events:", error);
        throw error;
    }
};