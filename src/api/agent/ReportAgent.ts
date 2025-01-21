import { Report } from "@/models/Report";
import { get } from "../agent"

export const getReportList = async (): Promise<Report[]> => {
    try {
        const response = await get<Report[]>("/report");
        return response;
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }
