/* eslint-disable @typescript-eslint/no-explicit-any */
import { Package } from "@/models/Package";
import { del, get, post } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";


export const PackageList = async (pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Package>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<Package>>>(`/Package?PageNumber=${pageNo}&PageSize=${pageSize}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};
export const createPackage = async (value: any): Promise<ResponseDTO<ResponseData<Package>>> => {
  try {
    const response = await post<ResponseDTO<ResponseData<Package>>>(`/Package/insert-package`, value);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const deactivePackage = async ( pkgId: string): Promise<ResponseDTO<Package>> => {
  try {
    const response = await del<ResponseDTO<Package>>(`/Package/deactive-package/${pkgId}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const PackageList3 = async (pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Package>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<Package>>>(`/Package?PageNumber=${pageNo}&PageSize=${pageSize}`);
    return response;
  } catch (error: any) {
    console.error("Error in Package API call:", error.response || error);
    throw error;
  }
};
