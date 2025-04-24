/* eslint-disable @typescript-eslint/no-explicit-any */
import { isInClubResponse } from "@/models/Club";
import { get, post } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { EventClubDTO } from "../representative/EventAgent";
import toast from "react-hot-toast";
import { TaskDependencyResponseDTO } from "@/models/InterTask";

export interface EventTaskDetailAIResponseDTO {
  eventTaskDetailId: string;
  eventTaskId: string;
  detailName: string;
  description: string;
  startTime: string;
  deadline?: string | null;
  submissionDate?: string | null;
  comment?: string | null;
  submissionScore: number;
  status: string;
}

export interface AvailableMemberEventTask {
  userId: string;
  clubMemberId: string;
  email: string;
  fullName: string;
  studentId: string;
  clubActivityPoint: number;
  reason?: string;
  currentTasks?: EventTaskDetailAIResponseDTO[];
  relatedTasks?: EventTaskDetailAIResponseDTO[];
}

export interface TaskRecommendedAI {
  clubId: string;
  taskName: string;
  taskDescription: string;
  startTime: string;
  endTime: string;
  priority: string;
}

export interface EventSubTaskDTO {
  eventTaskId: string;
  clubId: string;
  eventId: string;
  taskName: string;
  description: string;
  startTime: Date;
  deadline: Date;
  status: string;
  eventTaskDetails: EventSubTaskDetail[];
}

export interface EventSubTaskDetail {
  eventTaskId: string;
  detailName: string;
  description: string;
  startTime: string;
  deadline: string;
  priority: string;
  assignedMemberIds: string[];
  taskDependencyIds?: string[];
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
  clubId: string,
  startTime: string,
  deadline: string,
  priority: string
): Promise<ResponseDTO<AvailableMemberEventTask[]>> => {
  try {
    const response = await get<ResponseDTO<AvailableMemberEventTask[]>>(
      `/Tasks/Club/${clubId}/available-members?StartTime=${startTime}&Deadline=${deadline}&Priority=${priority}`,
      {
        param: {
          StartTime: startTime,
          Deadline: deadline,
          Priority: priority,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};

export const TaskRecommendedByAI = async (
  clubId: string,
  data: TaskRecommendedAI
): Promise<ResponseDTO<AvailableMemberEventTask[]>> => {
  try {
    const response = await post<ResponseDTO<AvailableMemberEventTask[]>>(
      `/Tasks/Club/${clubId}/recommend-members`,
      data
    );

    return response;
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 404) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 204) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const CreateSubTaskAPI = async (
  eventTaskId: string,
  data: EventSubTaskDetail
): Promise<ResponseDTO<string>> => {
  try {
    const response = await post<ResponseDTO<string>>(
      `/EventTask/${eventTaskId}/eventTaskDetail`,
      data
    );

    return response;
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 404) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const GetAvailableTask = async (
  eventTaskId: string,
  startTime: string,
  deadline: string,
  priority: string
): Promise<ResponseDTO<TaskDependencyResponseDTO[]>> => {
  try {
    const response = await get<ResponseDTO<TaskDependencyResponseDTO[]>>(
      `/EventTask/${eventTaskId}/dependencies?StartTime=${startTime}&Deadline=${deadline}&Priority=${priority}`,
      {
        param: {
          StartTime: startTime,
          Deadline: deadline,
          Priority: priority,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
};
