/* eslint-disable @typescript-eslint/no-explicit-any */
import { getStaff, Role, Student } from "@/models/User";
import { get } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";

export const getStudentList = async (role: string, pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Student>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<Student>>>(`/User?role=${role}&PageNumber=${pageNo}&PageSize=${pageSize}`);
    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
}

export const StaffList = async (role: string, pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<getStaff>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<getStaff>>>(`/User?role=${role}&PageNumber=${pageNo}&PageSize=${pageSize}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};
export const roleList = async (): Promise<Role> => {
  try {
    const response = await get<Role>("/Role");
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const getUserDetail = async (userId: string): Promise<ResponseDTO<Student>> => {
  try {
    const response = await get<ResponseDTO<Student>>(`/User/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
}