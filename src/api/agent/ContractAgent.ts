/* eslint-disable @typescript-eslint/no-explicit-any */
import { Contract } from "@/models/Contract";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { get } from "../agent";

export const ContractList = async (pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Contract>>> => {
    try {
      const response = await get<ResponseDTO<ResponseData<Contract>>>(`/Contracts?PageNumber=${pageNo}&PageSize=${pageSize}`);
      return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
      console.error("Error in UniversityList API call:", error.response || error);
      throw error;
    }
  };
export const getContractDetail = async (contractId: string): Promise<ResponseDTO<Contract>> => {
    try {
      const response = await get<ResponseDTO<Contract>>(`/Contracts/${contractId}`);
      return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
      console.error("Error in UniversityList API call:", error.response || error);
      throw error;
    }
  };