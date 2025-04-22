/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AIRecommend,
  AvailableMember,
  CreateInterTaskRequest,
  InterTask,
  InterTaskSubmission,
  ReviewInterTaskSubmissionRequest,
  UpdateInterTaskRequest,
} from "@/models/InterTask";
import { get, post, put } from "../agent";
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
