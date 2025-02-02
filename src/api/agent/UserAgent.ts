import { Student } from "@/models/User";
import { get } from "../agent";

export const getStudentList = async (): Promise<Student[]> => {
    try {
        const response = await get<Student[]>("https://678e1effa64c82aeb11f15e7.mockapi.io/student");
        return response;
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }