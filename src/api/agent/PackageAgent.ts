import { Package } from "@/models/Package";
import { get } from "../agent";

export const PackageList = async (): Promise<Package[]> => {
  try {
    const response = await get<Package[]>("/package"); // Gọi endpoint
    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};

