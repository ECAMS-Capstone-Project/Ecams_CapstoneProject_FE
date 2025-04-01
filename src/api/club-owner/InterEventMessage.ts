/* eslint-disable @typescript-eslint/no-explicit-any */

import { get } from "../agent";
import {  ResponseDTO } from "../BaseResponse";
import { Message } from "@/models/Message";


export const GetInterMessage = async (eventId: string): Promise<ResponseDTO<Message>> => {
    try {
        const response = await get<ResponseDTO<Message>>(`/Message?eventId=${eventId}`);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};