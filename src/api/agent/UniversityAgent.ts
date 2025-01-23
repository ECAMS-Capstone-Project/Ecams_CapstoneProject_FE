/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "../agent";
import { University } from "@/models/University";
import { ResponseData, ResponseDTO } from "../BaseResponse";

export const UniversityList2 = async (pageSize: number, PageNumber:number): Promise<ResponseDTO<ResponseData<University>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<University>>>(`http://localhost:5214/api/Universities/universities?PageNumber=${PageNumber}&PageSize=${pageSize}`); // Gọi endpoint
    console.log("Universitiiiiiiiii" + response);
const apiRes = response as ResponseDTO<ResponseData<University>>;
    return apiRes ;
    
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};

export const UniversityList = async (pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<University>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<University>>>(`http://localhost:5214/api/Universities/universities?PageNumber=${pageNo}&PageSize=${pageSize}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};
