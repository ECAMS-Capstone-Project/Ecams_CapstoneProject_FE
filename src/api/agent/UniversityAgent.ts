/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "../agent";
import { University } from "@/models/University";
import { ResponseData, ResponseDTO } from "../BaseResponse";


export const UniversityList = async (pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<University>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<University>>>(`http://localhost:5214/api/Universities/universities?PageNumber=${pageNo}&PageSize=${pageSize}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};
