/* eslint-disable @typescript-eslint/no-explicit-any */
import { Package } from "@/models/Package";
import { ResponseData, ResponseDTO } from "../BaseResponse";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { University } from "@/models/University";
import { del, get, patch } from "../agent";


export const UniversityList = async (pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<University>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<University>>>(`http://localhost:5214/api/Universities?PageNumber=${pageNo}&PageSize=${pageSize}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};
export const approveUni = async (uniId: string): Promise<ResponseDTO<University>> => {
  try {
    const response = await patch<ResponseDTO<University>>(`http://localhost:5214/api/Universities/approve-university/${uniId}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};
export const rejectUni = async (uni: any): Promise<ResponseDTO<University>> => {
  try {
    const response = await patch<ResponseDTO<University>>(`http://localhost:5214/api/Universities/reject-university`, uni);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const reactiveUni = async (uniId: string): Promise<ResponseDTO<University>> => {
  try {
    const response = await patch<ResponseDTO<University>>(`http://localhost:5214/api/Universities/reactive-university/${uniId}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const deactiveUni = async (uni: any): Promise<ResponseDTO<University>> => {
  try {
    const response = await del<ResponseDTO<University>>(`http://localhost:5214/api/Universities/deactive-university`, uni);
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