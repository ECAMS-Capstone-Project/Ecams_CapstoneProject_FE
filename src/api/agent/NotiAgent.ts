/* eslint-disable @typescript-eslint/no-explicit-any */
import { Noti } from "@/models/Notification";
import { get } from "../agent";
import axios from "axios";

export const getNotification = async (): Promise<Noti[]> => {
    try {
        const response = await get<Noti[]>("https://651822f6582f58d62d356e1a.mockapi.io/notification");
        return response;
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }
export const createNotification = async (noti: any): Promise<Noti[]> => {
    try {
        const response = await axios.post<Noti[]>("https://651822f6582f58d62d356e1a.mockapi.io/notification", noti);
        return response.data;
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }
export const deleteNotification = async (notiId: string): Promise<Noti[]> => {
    try {
        const response = await axios.delete<Noti[]>(`https://651822f6582f58d62d356e1a.mockapi.io/notification/${notiId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }