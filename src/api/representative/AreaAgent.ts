/* eslint-disable @typescript-eslint/no-explicit-any */
import { Area, AreaDetails } from "@/models/Area";
import { del, get } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import axiosMultipartForm from "../axiosMultipartForm";
import toast from "react-hot-toast";

export const getMockAreaList = async (): Promise<Area[]> => {
    try {
        const response = await get<Area[]>("https://653b3b742e42fd0d54d4d308.mockapi.io/area");
        
        return response;
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }

    export const getAreaList = async (pageSize: number, pageNo: number, uniId: string): Promise<ResponseDTO<ResponseData<Area>>> => {
        try {
          const response = await get<ResponseDTO<ResponseData<Area>>>(`/Area?UniversityId=${uniId}&PageNumber=${pageNo}&PageSize=${pageSize}`);
          return response; // Trả về toàn bộ phản hồi
        } catch (error: any) {
          console.error("Error in UniversityList API call:", error.response || error);
          throw error;

        }
      };



export const createArea = async (formData: FormData): Promise<ResponseDTO<AreaDetails | string>> => {
  try {
      const response = await axiosMultipartForm.post("/Area/insert-area", formData);
      const apiResponse = response.data as ResponseDTO<AreaDetails | string>;

        if (apiResponse.data && typeof apiResponse.data === "string") {
            // Nếu API trả về một chuỗi (thông báo hoặc URL)
            console.log("Response String:", apiResponse.data);
            return apiResponse;
        } else if (apiResponse.data && typeof apiResponse.data === "object") {
            // Nếu API trả về chi tiết khu vực đã thêm
            console.log("Area Details:", apiResponse.data);
            return apiResponse;
        } else {
            console.error("Unexpected response data format");
            throw new Error("Unexpected response data format");
        }
    } catch (error: any) {
        if (error.response) {
            console.error("API Error:", error.response.data.errors);
            toast.error(error.response.data.message || "API Error");
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            toast.error("Network error. Please try again later.");
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const updateArea = async (formData: FormData): Promise<ResponseDTO<AreaDetails | string>> => {
  try {
      const response = await axiosMultipartForm.put("/Area/update-area", formData);
      const apiResponse = response.data ;
        if (apiResponse.data && typeof apiResponse.data === "string") {
            // Nếu API trả về một chuỗi (thông báo hoặc URL)
            console.log("Response String:", apiResponse.data);
            return apiResponse;
        } 
         else if(apiResponse.data && typeof apiResponse.data === "object") {
            // Nếu API trả về chi tiết khu vực đã thêm
            console.log("Area Details:", apiResponse.data);
            return apiResponse;
        } else {
            return apiResponse;
        }
    } catch (error: any) {
        if (error.response) {
            console.error("API Error:", error.response.data.errors);
            toast.error(error.response.data.message || "API Error");
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            toast.error("Network error. Please try again later.");
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const deactiveArea = async (areaId: string): Promise<ResponseDTO<Area>> => {
    try {
      const response = await del<ResponseDTO<Area>>(`/Area/deactive-area/${areaId}`);
      return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
      console.error("Error in deactive area API call:", error.response || error);
      throw error;
    }
  };