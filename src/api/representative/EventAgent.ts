/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event } from "@/models/Event";
import { get, put } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import axiosMultipartForm from "../axiosMultipartForm";
import toast from "react-hot-toast";
import { FieldDTO } from "../club-owner/RequestClubAPI";
import { ClubMemberDTO } from "../club-owner/ClubByUser";

export interface EventClubDTO {
  clubId: string;
  clubName: string;
  logoUrl: string;
  description: string;
  purpose: string;
  foundingDate: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  clubFields?: FieldDTO[];
  clubMembers?: ClubMemberDTO[];
  isEventClub: boolean;
}

export const getEventList = async (
  uniId: string,
  pageNumber: number,
  pageSize: number
): Promise<ResponseDTO<ResponseData<Event>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<Event>>>(
      `/Event?UniversityId=${uniId}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );

    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};
// 1) Định nghĩa kiểu cho filter (nếu cần)
export interface EventFilterParams {
  type?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  // ... các trường khác
}

// 2) Hàm buildQueryString đơn giản để nối param
function buildQueryString(baseUrl: string, params: Record<string, any>) {
  const query = Object.entries(params)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  return query ? `${baseUrl}?${query}` : baseUrl;
}

// 3) Sửa hàm getAllEventList
export const getAllEventList = async (
  pageNumber: number,
  pageSize: number,
  filterParams?: EventFilterParams
): Promise<ResponseDTO<ResponseData<Event>>> => {
  // Xây dựng đối tượng params
  const queryParams = {
    PageNumber: pageNumber,
    PageSize: pageSize,
    Type: filterParams?.type,
    StartDate: filterParams?.startDate,
    EndDate: filterParams?.endDate,
    Status: "ACTIVE",
    // ... các filter khác nếu có
  };

  // Tạo URL
  const url = buildQueryString("/Event", queryParams);

  try {
    const response = await get<ResponseDTO<ResponseData<Event>>>(url);
    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventDetail = async (
  eventId: string,
  userId: string
): Promise<ResponseDTO<Event>> => {
  try {
    const response = await get<ResponseDTO<Event>>(
      `/Event/${eventId}?userId=${userId}`
    );

    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};
export const getEventClubDetail = async (
  clubId: string
): Promise<ResponseDTO<EventClubDTO>> => {
  try {
    const response = await get<ResponseDTO<EventClubDTO>>(`/Clubs/${clubId}`);

    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};
export const getEventClub = async (
  uniId: string,
  pageNumber: number,
  pageSize: number
): Promise<ResponseDTO<ResponseData<EventClubDTO>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<EventClubDTO>>>(
      `/Clubs/university/${uniId}?PageNumber=${pageNumber}&PageSize=${pageSize}`
    );

    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};

export const createEvent = async (
  formData: FormData
): Promise<ResponseDTO<Event | string>> => {
  try {
    const response = await axiosMultipartForm.post(
      "/Event/insert-event",
      formData
    );
    const apiResponse = response.data as ResponseDTO<Event | string>;

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
      console.error("API Error:", error);
      toast.error(error.response.data.message || "API Error");
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      toast.error("Network error. Please try again later.");
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const approveEvent = async (
  eventId: string,
  walletId: string
): Promise<ResponseDTO<Event>> => {
  try {
    const response = await put<ResponseDTO<Event>>(`/Event/approve-event`, {
      eventId,
      walletId,
    });
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};
export const rejectEvent = async (event: any): Promise<ResponseDTO<Event>> => {
  try {
    const response = await put<ResponseDTO<Event>>(
      `/Event/reject-event`,
      event
    );
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const createEventClub = async (
  formData: FormData
): Promise<ResponseDTO<EventClubDTO | string>> => {
  try {
    const response = await axiosMultipartForm.post(
      "/Clubs/event-club",
      formData
    );
    const apiResponse = response.data as ResponseDTO<EventClubDTO | string>;

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
