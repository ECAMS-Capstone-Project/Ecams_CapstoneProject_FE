/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, patch, del } from "../agent";
import { University } from "@/models/University";
import { ResponseData, ResponseDTO } from "../BaseResponse";

export const UniversityList = async (pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<University>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<University>>>(`/Universities?PageNumber=${pageNo}&PageSize=${pageSize}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};
export const approveUni = async (uniId: string): Promise<ResponseDTO<University>> => {
  try {
    const response = await patch<ResponseDTO<University>>(`/Universities/approve-university/${uniId}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};
export const rejectUni = async (uni: any): Promise<ResponseDTO<University>> => {
  try {
    const response = await patch<ResponseDTO<University>>(`/Universities/reject-university`, uni);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const reactiveUni = async (uniId: string): Promise<ResponseDTO<University>> => {
  try {
    const response = await patch<ResponseDTO<University>>(`/Universities/reactive-university/${uniId}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const deactiveUni = async (uni: any): Promise<ResponseDTO<University>> => {
  try {
    const response = await del<ResponseDTO<University>>(`/Universities/deactive-university`, uni);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};