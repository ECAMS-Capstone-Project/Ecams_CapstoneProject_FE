/* eslint-disable @typescript-eslint/no-explicit-any */
import { Policy } from "@/models/Policy";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { get, post } from "../agent";

export const getPolicyList = async (pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Policy>>> => {
    try {
      const response = await get<ResponseDTO<ResponseData<Policy>>>(`http://localhost:5214/api/Policy?PageNumber=${pageNo}&PageSize=${pageSize}`);
      return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
      console.error("Error in UniversityList API call:", error.response || error);
      throw error;
    }
  };

  export const createPolicy = async (value: any): Promise<ResponseDTO<ResponseData<Policy>>> => {
    try {
      const response = await post<ResponseDTO<ResponseData<Policy>>>(`http://localhost:5214/api/Policy`, value);
      return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
      console.error("Error in UniversityList API call:", error.response || error);
      throw error;
    }
  };