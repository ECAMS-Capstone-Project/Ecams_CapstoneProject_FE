/* eslint-disable @typescript-eslint/no-explicit-any */
import { Participant } from "@/models/Participants";
import { get, patch } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import axiosMultipartForm from "../axiosMultipartForm";
import toast from "react-hot-toast";
import { InterClubEventDTO } from "@/models/Event";


export interface InterClubEvent {
    eventId: string;
    universityId: string;
    representativeId: string;
    representativeName: string;
    clubId: string;
    clubName: string;
    eventName: string;
    imageUrl: string;
    description: string;
    listClubName: string[];
    registeredStartDate: Date;
    registeredEndDate: Date;
    price: number;
    maxParticipants: number;
    trainingPoint: number;
    eventArea: string;
    eventType: string;
    status: "ACTIVE" | "INACTIVE" | "PENDING" | "WAITING";
  }

export const GetEventParticipants = async (eventId: string, pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Participant>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<Participant>>>(`/Event/participants?EventId=${eventId}&PageNumber=${pageNo}&PageSize=${pageSize}`);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const createInterClubEvent = async (formData: FormData): Promise<ResponseDTO<InterClubEvent | string>> => {
    try {
        const response = await axiosMultipartForm.post("/Event/inter-club-event", formData);
        const apiResponse = response.data as ResponseDTO<InterClubEvent | string>;
  
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


export const GetInterEvent = async (clubId: string, pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<InterClubEventDTO>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<InterClubEventDTO>>>(`/InterClub?clubId=${clubId}&PageNumber=${pageNo}&PageSize=${pageSize}`);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};
export const GetInterEventRequest = async (clubId: string, pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<InterClubEventDTO>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<InterClubEventDTO>>>(`/InterClub?clubId=${clubId}&status=PENDING&PageNumber=${pageNo}&PageSize=${pageSize}`);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};
export const GetInterClubEventDetail = async (eventId: string): Promise<ResponseDTO<InterClubEventDTO>> => {
    try {
        const response = await get<ResponseDTO<InterClubEventDTO>>(`/InterClub/${eventId}`);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const approveInterEvent = async (event:any): Promise<ResponseDTO<Event>> => {
    try {
      const response = await patch<ResponseDTO<Event>>(`/InterClub/accept-inter`, event);
      return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
      console.error("Error in UniversityList API call:", error.response || error);
      throw error;
    }
  };
  export const rejectInterEvent = async (event: any): Promise<ResponseDTO<Event>> => {
    try {
      const response = await patch<ResponseDTO<Event>>(`/InterClub/reject-inter`, event);
      return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
      console.error("Error in UniversityList API call:", error.response || error);
      throw error;
    }
  };
  