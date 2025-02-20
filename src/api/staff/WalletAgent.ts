/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wallet } from "@/models/Wallet";
import { del, get, post, put } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";

export const getWalletList = async (universityId: string, token:string,pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Wallet>>> => {
    try {
      const response = await get<ResponseDTO<ResponseData<Wallet>>>(`/Wallet?UniversityId=${universityId}&Token=${token}&PageNumber=${pageNo}&PageSize=${pageSize}`);
      return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
      console.error("Error in UniversityList API call:", error.response || error);
      throw error;

    }
  };

  export const insertWallet = async (values: any): Promise<Wallet[]> => {
    try {
      const response = await post<Wallet[]>(`/Wallet/insert-wallet`, values);
      return response;
    } catch (error) {
      console.error("Error fetching university list:", error);
      throw error;
    }
  }
  export const updateWallet = async (values: any): Promise<Wallet[]> => {
    try {
      console.log("API Payload:", values);
      const response = await put<Wallet[]>(`/Wallet/update-wallet`, values);
      return response;
    } catch (error) {
      console.error("Error fetching university list:", error);
      throw error;
    }
  }

export const deactiveWallet = async (walletId: string): Promise<ResponseDTO<Wallet>> => {
  try {
    const response = await del<ResponseDTO<Wallet>>(`/Wallet/deactive-wallet/${walletId}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in deactive area API call:", error.response || error);
    throw error;
  }
};