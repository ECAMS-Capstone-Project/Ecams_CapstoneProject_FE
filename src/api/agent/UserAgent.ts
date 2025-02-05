/* eslint-disable @typescript-eslint/no-explicit-any */
import { getStaff, Student } from "@/models/User";
import { get } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";

export const getStudentList = async (): Promise<Student[]> => {
    try {
        const response = await get<Student[]>("https://678e1effa64c82aeb11f15e7.mockapi.io/student");
        return response;
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }

    export const StaffList = async (pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<getStaff>>> => {
        try {
          const response = await get<ResponseDTO<ResponseData<getStaff>>>(`http://localhost:5214/api/User/staffs?PageNumber=${pageNo}&PageSize=${pageSize}`);
          return response; // Trả về toàn bộ phản hồi
        } catch (error: any) {
          console.error("Error in UniversityList API call:", error.response || error);
          throw error;
        }
      };