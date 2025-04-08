import toast from "react-hot-toast";
import { get, put } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { Contract } from "@/models/Contract";

export const ContractRepresentative = async (pageSize: number, pageNo: number, representativeId: string, status?: boolean): Promise<ResponseDTO<ResponseData<Contract>>> => {
    try {
        let response: ResponseDTO<ResponseData<Contract>>;
        if (status != null || undefined) {
            response = await get<ResponseDTO<ResponseData<Contract>>>(`/Contracts/contracts-of-representative/?Status=${status}&PageNumber=${pageNo}&PageSize=${pageSize}&representativeId=${representativeId}`);
        } else {
            response = await get<ResponseDTO<ResponseData<Contract>>>(`/Contracts/contracts-of-representative/?PageNumber=${pageNo}&PageSize=${pageSize}&representativeId=${representativeId}`);
        }
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const CancelContractRepresentative = async (contractId: string, representativeId: string, reason: string): Promise<ResponseDTO<string>> => {
    try {
        const data = { contractId: contractId, representativeId: representativeId, reason: reason };
        const response = await put<ResponseDTO<string>>(`/Contracts/${contractId}/cancel`, data);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const ContractRepresentativeById = async (representativeId: string): Promise<ResponseDTO<Contract>> => {
    try {
        const response = await get<ResponseDTO<Contract>>(`/Contracts/${representativeId}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const GetContractCurrentAPI = async (representativeId: string): Promise<ResponseDTO<Contract>> => {
    try {
        const response = await get<ResponseDTO<Contract>>(`/Contracts/Representative/${representativeId}/current`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};