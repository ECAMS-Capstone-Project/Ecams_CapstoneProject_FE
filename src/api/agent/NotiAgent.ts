/* eslint-disable @typescript-eslint/no-explicit-any */
import { Noti } from "@/models/Notification";
import { del, get, post } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";

export const getNotification1 = async (): Promise<Noti[]> => {
  try {
    const response = await get<Noti[]>("https://651822f6582f58d62d356e1a.mockapi.io/notification");
    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
}

export const getNotification = async (pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Noti>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<Noti>>>(`/Notification?PageNumber=${pageNo}&PageSize=${pageSize}`);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};
export const createNotification = async (noti: any): Promise<Noti[]> => {
  try {
    const response = await post<Noti[]>(`/Notification/insert-notification`, noti);
    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
}
export const deleteNotification = async (notiId: string): Promise<Noti[]> => {
  try {
    const response = await del<Noti[]>(`/Notification/delete-notification?id=${notiId}`);
    return response;
  } catch (error) {
    console.error("Error fetching university list:", error);
    throw error;
  }
}