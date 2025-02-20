/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { get, post } from "../agent";
import { ResponseDTO } from "../BaseResponse";
import axiosMultipartForm from "../axiosMultipartForm";

export interface FieldDTO {
    fieldId: string,
    fieldName: string
}
export const GetAllFields = async (): Promise<ResponseDTO<FieldDTO[]>> => {
    try {
        const response = await get<ResponseDTO<FieldDTO[]>>(`/Fields?PageNumber=1&PageSize=100`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const CreateFieldsAPI = async (fieldName: string): Promise<ResponseDTO<string>> => {
    try {
        const data = { fieldName: fieldName }
        const response = await post<ResponseDTO<string>>(`/Fields`, data);
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

export const RequestClubAPI = async (formData: FormData): Promise<ResponseDTO<string>> => {
    try {
        const response = await axiosMultipartForm.post("/Clubs", formData);
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