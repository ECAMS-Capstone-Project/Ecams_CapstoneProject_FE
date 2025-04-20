import { isInClubResponse } from "@/models/Club";
import { get } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { EventClubDTO } from "../representative/EventAgent";
export interface AvailableMemberEventTask {
    userId: string;
    clubMemberId: string;
    email: string;
    fullName: string;
    studentId: string;
    clubActivityPoint: number;
    reason?: string;
    currentTasks?: [];
    relatedTasks?: [];
  }
export const getClub = async (
  uniId: string,
  pageNumber: number,
  pageSize: number
): Promise<ResponseDTO<ResponseData<EventClubDTO>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<EventClubDTO>>>(
      `/Clubs/university/${uniId}?PageNumber=${pageNumber}&PageSize=${pageSize}`
    );

    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};

export const checkIsInClub = async (
  userId: string,
  clubId: string
): Promise<ResponseDTO<isInClubResponse>> => {
  try {
    const response = await get<ResponseDTO<isInClubResponse>>(
      `/Clubs/${clubId}/User/${userId}/check`
    );

    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};

export const GetAvailableMember = async (
  clubId: string,startTime: Date | null, deadline: Date | null, priority: string
): Promise<ResponseDTO<AvailableMemberEventTask[]>> => {
  try {
    const response = await get<ResponseDTO<AvailableMemberEventTask[]>>(
      `/Tasks/Club/${clubId}?StartTime=${startTime}&Deadline=${deadline}&Priority=${priority}`,
      {
        param: {
            StartTime: startTime,
            Deadline: deadline,
            Priority: priority
        }
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};
