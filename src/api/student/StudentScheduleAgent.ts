import { UserSchedule } from "@/models/User";
import { get } from "../agent";
import { ResponseDTO } from "../BaseResponse";

export const getSchedule = async (userId: string): Promise<ResponseDTO<UserSchedule>> => {
    try {
        const response = await get<ResponseDTO<UserSchedule>>(`/User/${userId}/schedule`);
    
        
        return response;
        
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }