/* eslint-disable @typescript-eslint/no-explicit-any */
import { Package } from "@/models/Package";
import { get } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";

export const PackageList2 = async (): Promise<Package[]> => {
  try {
    const response = await get<Package[]>("/package"); // Gọi endpoint
    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};

export const PackageList = async (pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Package>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<Package>>>(`http://localhost:5214/api/Package/packages?PageNumber=${pageNo}&PageSize=${pageSize}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};
