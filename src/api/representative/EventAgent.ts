import { Event } from "@/models/Event";
import { get } from "../agent";

export const getEventList = async (): Promise<Event[]> => {
    try {
        const response = await get<Event[]>("https://653b3b742e42fd0d54d4d308.mockapi.io/pakage-detail");
        
        return response;
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }
