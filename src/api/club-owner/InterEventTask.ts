/* eslint-disable @typescript-eslint/no-explicit-any */
import { InterTask } from "@/models/InterTask";
import { get } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";


export const GetInterTask = async (eventId: string, pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<InterTask>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<InterTask>>>(`/EventTask/Event/${eventId}?PageNumber=${pageNo}&PageSize=${pageSize}`);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};