/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from "../agent";
import { ResponseDTO } from "../BaseResponse";

export interface StatisticResponse {
    revenue: number;
    numOfStudents: number;
    numOfEvents: number;
    numOfClubs: number;
}

export const GetStatisticUniversity = async (universityId: string): Promise<ResponseDTO<StatisticResponse>> => {
    try {
        const response = await get<ResponseDTO<StatisticResponse>>(`/Statistic/university/${universityId}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};
