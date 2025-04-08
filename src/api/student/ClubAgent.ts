import { isInClubResponse } from "@/models/Club";
import { get } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { EventClubDTO } from "../representative/EventAgent";

export const getClub = async (uniId: string, pageNumber: number, pageSize: number): Promise<ResponseDTO<ResponseData<EventClubDTO>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<EventClubDTO>>>(`/Clubs/university/${uniId}?PageNumber=${pageNumber}&PageSize=${pageSize}`);
    
        
        return response;
        
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }

export const checkIsInClub = async (userId: string, clubId: string): Promise<ResponseDTO<isInClubResponse>> => {
            try {
                const response = await get<ResponseDTO<isInClubResponse>>(`/Clubs/${clubId}/User/${userId}/check`);
    
        
        return response;
        
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }

