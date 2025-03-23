import { Participant } from "@/models/Participants";
import { get } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";

export const GetEventParticipants = async (eventId: string, pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Participant>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<Participant>>>(`/Event/participants?EventId=${eventId}&PageNumber=${pageNo}&PageSize=${pageSize}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};