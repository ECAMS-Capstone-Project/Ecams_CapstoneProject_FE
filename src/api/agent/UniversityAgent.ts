import { get } from "../agent";
import { University } from "@/models/University";

export const UniversityList = async (): Promise<University[]> => {
  try {
    const response = await get<University[]>("/university"); // Gọi endpoint
    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};
