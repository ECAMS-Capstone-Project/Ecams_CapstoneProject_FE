import toast from "react-hot-toast";
import { get, put } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { Contract } from "@/models/Contract";

export const ContractStaff = async (pageSize: number, pageNo: number, staffId: string, status?: boolean): Promise<ResponseDTO<ResponseData<Contract>>> => {
    try {
        let response: ResponseDTO<ResponseData<Contract>>;
        if (status != null || undefined) {
            response = await get<ResponseDTO<ResponseData<Contract>>>(`/Contracts/contracts-of-staff/?Status=${status}&PageNumber=${pageNo}&PageSize=${pageSize}&staffId=${staffId}`);
        } else {
            response = await get<ResponseDTO<ResponseData<Contract>>>(`/Contracts/contracts-of-staff/?PageNumber=${pageNo}&PageSize=${pageSize}&staffId=${staffId}`);
        }
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const CancelContractStaff = async (contractId: string, staffId: string): Promise<ResponseDTO<string>> => {
    try {
        const data = { contractId: contractId, staffId: staffId }
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

export const ContractStaffById = async (staffId: string): Promise<ResponseDTO<Contract>> => {
    try {
        const response = await get<ResponseDTO<Contract>>(`/Contracts/${staffId}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};