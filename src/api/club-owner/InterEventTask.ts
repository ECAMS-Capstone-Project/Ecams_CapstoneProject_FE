/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateInterTaskRequest,
  InterTask,
  UpdateInterTaskRequest,
} from "@/models/InterTask";
import { get, post, put } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";

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
