import { UserSchedule } from "@/models/User";
import { get } from "../agent";
import { ResponseDTO } from "../BaseResponse";
import { StudentTrainingPoint } from "@/pages/representative/approveStudent/ExportButton";

export const getSchedule = async (
  userId: string
): Promise<ResponseDTO<UserSchedule>> => {
  try {
    const response = await get<ResponseDTO<UserSchedule>>(
      `/User/${userId}/schedule`
    );

    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};

export const exportStudentAPI = async (
  universityId: string,
  startDate: string,
  endDate: string
): Promise<ResponseDTO<StudentTrainingPoint[]>> => {
  try {
    const response = await get<ResponseDTO<StudentTrainingPoint[]>>(
      `/Students/university/${universityId}/training-point`,
      {
        params: {
          StartDate: startDate,
          EndDate: endDate,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};
