import { Feedback, FeedbackRequest } from "@/models/Feedback";
import { ResponseDTO, ResponseData } from "../BaseResponse";
import { get, post } from "../agent";

export const getFeedback = async (
  eventId: string,
  rating?: number | null,
  pageNumber?: number,
  pageSize?: number
): Promise<ResponseDTO<ResponseData<Feedback>>> => {
  const response = await get<ResponseDTO<ResponseData<Feedback>>>(
    `/Feedback?EventId=${eventId}` +
      (rating ? `&Rating=${rating}` : "") +
      `&PageNumber=${pageNumber}&PageSize=${pageSize}`
  );
  return response;
};

export const createFeedback = async (
  feedback: FeedbackRequest
): Promise<ResponseDTO<ResponseData<Feedback[]>>> => {
  const response = await post<ResponseDTO<ResponseData<Feedback[]>>>(
    `/Feedback`,
    feedback
  );
  return response;
};
