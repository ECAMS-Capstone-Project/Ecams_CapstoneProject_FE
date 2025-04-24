/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AIRecommend,
  AvailableMember,
  CreateInterTaskRequest,
  InterTask,
  InterTaskSubmission,
  ReviewInterTaskSubmissionRequest,
  SubtaskCreateRequest,
  UpdateInterTaskRequest,
  UpdateInterTaskRequest2,
  UpdateSubtaskRequest,
} from "@/models/InterTask";
import { get, post, put, del } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { AIRecommendResponse } from "@/models/Task";

export const GetInterTask = async (
  eventId: string,
  pageSize: number,
  pageNo: number
): Promise<ResponseDTO<ResponseData<InterTask>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<InterTask>>>(
      `/EventTask/Event/${eventId}?PageNumber=${pageNo}&PageSize=${pageSize}`
    );
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const CreateInterTask = async (
  task: CreateInterTaskRequest
): Promise<ResponseDTO<CreateInterTaskRequest>> => {
  try {
    const response = await post<ResponseDTO<CreateInterTaskRequest>>(
      `/EventTask/event-task`,
      task
    );
    return response;
  } catch (error: any) {
    console.error(
      "Error in CreateInterTask API call:",
      error.response || error
    );
    throw error;
  }
};

export const UpdateInterTask = async (
  task: UpdateInterTaskRequest
): Promise<ResponseDTO<UpdateInterTaskRequest>> => {
  try {
    const response = await put<ResponseDTO<UpdateInterTaskRequest>>(
      `/EventTask/${task.eventTaskId}`,
      task
    );
    return response;
  } catch (error: any) {
    console.error(
      "Error in UpdateInterTask API call:",
      error.response || error
    );
    throw error;
  }
};
export const GetInterTaskDetail = async (
  eventTaskId: string
): Promise<ResponseDTO<InterTask>> => {
  const response = await get<ResponseDTO<InterTask>>(
    `/EventTask/${eventTaskId}`
  );
  return response;
};
export const GetAIRecommendation = async (
  task: AIRecommend,
  clubId: string
): Promise<ResponseDTO<AIRecommendResponse[]>> => {
  try {
    const response = await post<ResponseDTO<AIRecommendResponse[]>>(
      `/Tasks/Club/${clubId}/recommend-members`,
      task
    );
    return response;
  } catch (error: any) {
    console.error(
      "Error in AI Recommendation API call:",
      error.response || error
    );
    throw error;
  }
};

export const GetAvailableMember = async (
  clubId: string,
  startTime: string,
  deadline: string,
  priority: string,
  taskId?: string
): Promise<ResponseDTO<AvailableMember>> => {
  try {
    const response = await get<ResponseDTO<AvailableMember>>(
      `Tasks/Club/${clubId}/available-members?` +
        (taskId ? `TaskId=${taskId}&` : "") +
        `StartTime=${startTime}&Deadline=${deadline}&Priority=${priority}`
    );
    return response;
  } catch (error: any) {
    console.error(
      "Error in GetAvailableMember API call:",
      error.response || error
    );
    throw error;
  }
};
export const GetInterTaskSubmission = async (
  eventTaskDetailId: string,
  memberName?: string,
  status?: string,
  pageSize?: number,
  pageNo?: number
): Promise<ResponseDTO<ResponseData<InterTaskSubmission>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<InterTaskSubmission>>>(
      `EventTask/EventTaskDetail/${eventTaskDetailId}/submissions?${
        memberName ? `MemberName=${memberName}&` : ""
      }${
        status ? `Status=${status}&` : ""
      }PageNumber=${pageNo}&PageSize=${pageSize}`
    );
    return response;
  } catch (error: any) {
    console.error(
      "Error in GetInterTaskSubmission API call:",
      error.response || error
    );
    throw error;
  }
};

export const ReviewInterTaskSubmission = async (
  review: ReviewInterTaskSubmissionRequest
): Promise<ResponseDTO<ReviewInterTaskSubmissionRequest>> => {
  try {
    const response = await put<ResponseDTO<ReviewInterTaskSubmissionRequest>>(
      `/EventTask/review`,
      review
    );
    return response;
  } catch (error: any) {
    console.error(
      "Error in ReviewInterTaskSubmission API call:",
      error.response || error
    );
    throw error;
  }
};

export const UpdateInterTask2 = async (
  task: UpdateInterTaskRequest2
): Promise<ResponseDTO<UpdateInterTaskRequest>> => {
  try {
    const response = await put<ResponseDTO<UpdateInterTaskRequest>>(
      `/EventTask/${task.eventTaskId}`,
      task
    );
    return response;
  } catch (error: any) {
    console.error(
      "Error in UpdateInterTask API call:",
      error.response || error
    );
    throw error;
  }
};

export const GetMemberEventTask = async (
  eventId: string,
  pageSize: number,
  pageNo: number,
  userId: string
): Promise<ResponseDTO<ResponseData<InterTask>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<InterTask>>>(
      `/EventTask/clubEvent/${eventId}/User/${userId}?PageNumber=${pageNo}&PageSize=${pageSize}`
    );
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const CreateSubtask = async (
  subtask: SubtaskCreateRequest,
  eventTaskId: string
): Promise<ResponseDTO<SubtaskCreateRequest>> => {
  try {
    const response = await post<ResponseDTO<SubtaskCreateRequest>>(
      `/EventTask/${eventTaskId}/eventTaskDetail`,
      subtask
    );
    return response;
  } catch (error: any) {
    console.error("Error in CreateSubtask API call:", error.response || error);
    throw error;
  }
};

export const GetSubtaskDependency = async (
  eventTaskId: string,
  startTime?: string,
  deadline?: string,
  priority?: string
): Promise<ResponseDTO<AvailableMember>> => {
  try {
    const response = await get<ResponseDTO<AvailableMember>>(
      `EventTask/${eventTaskId}/dependencies?StartTime=${startTime}&Deadline=${deadline}&Priority=${priority}`
    );
    return response;
  } catch (error: any) {
    console.error(
      "Error in GetAvailableMember API call:",
      error.response || error
    );
    throw error;
  }
};

export const UpdateSubtask = async (
  subtask: UpdateSubtaskRequest,
  eventTaskDetailId: string,
  eventTaskId: string
): Promise<ResponseDTO<UpdateSubtaskRequest>> => {
  try {
    const response = await put<ResponseDTO<UpdateSubtaskRequest>>(
      `/EventTask/${eventTaskId}/eventTaskDetail/${eventTaskDetailId}`,
      subtask
    );
    return response;
  } catch (error: any) {
    console.error("Error in UpdateSubtask API call:", error.response || error);
    throw error;
  }
};

export const DeleteSubtask = async (
  eventTaskDetailId: string,
  eventTaskId: string
): Promise<ResponseDTO<void>> => {
  try {
    const response = await del<ResponseDTO<void>>(
      `/EventTask/${eventTaskId}/eventTaskDetail/${eventTaskDetailId}`
    );
    return response;
  } catch (error: any) {
    console.error("Error in DeleteSubtask API call:", error.response || error);
    throw error;
  }
};
