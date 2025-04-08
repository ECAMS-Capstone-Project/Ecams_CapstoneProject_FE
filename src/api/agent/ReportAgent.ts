import { Report } from "@/models/Report";
import { get } from "../agent"

export const getReportList = async (): Promise<Report[]> => {
    try {
        const response = await get<Report[]>("https://678e1effa64c82aeb11f15e7.mockapi.io/report");
        
        return response;
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }
