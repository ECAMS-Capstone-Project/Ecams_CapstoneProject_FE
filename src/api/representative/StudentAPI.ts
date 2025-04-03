/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { get, patch } from "../agent";
import StudentRequest from "@/models/StudentRequest";

export const GetStudentAPI = async (pageSize: number, pageNo: number, status?: boolean): Promise<ResponseDTO<ResponseData<StudentRequest>>> => {
    try {
        let response: ResponseDTO<ResponseData<StudentRequest>>;
        if (status != null || undefined) {
            response = await get<ResponseDTO<ResponseData<StudentRequest>>>(`/Students?Status=${status}&PageNumber=${pageNo}&PageSize=${pageSize}`);
        } else {
            response = await get<ResponseDTO<ResponseData<StudentRequest>>>(`/Students?PageNumber=${pageNo}&PageSize=${pageSize}`);
        }
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};
export const approveStu = async (userId: string): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>(`/Students/${userId}/approve`);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};
export const rejectStu = async (userId: string, stu: any): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>(`/Students/${userId}/reject`, stu);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const GetStudentByIdAPI = async (userId: string): Promise<ResponseDTO<StudentRequest>> => {
    try {
        const response = await get<ResponseDTO<StudentRequest>>(`/Students/User/${userId}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

// export const reactiveUni = async (uniId: string): Promise<ResponseDTO<University>> => {
//     try {
//         const response = await patch<ResponseDTO<University>>(`/Universities/reactive-university/${uniId}`);
//         return response; // Trả về toàn bộ phản hồi
//     } catch (error: any) {
//         console.error("Error in UniversityList API call:", error.response || error);
//         throw error;
//     }
// };

// export const deactiveUni = async (uni: any): Promise<ResponseDTO<University>> => {
//     try {
//         const response = await del<ResponseDTO<University>>(`/Universities/deactive-university`, uni);
//         return response; // Trả về toàn bộ phản hồi
//     } catch (error: any) {
//         console.error("Error in UniversityList API call:", error.response || error);
//         throw error;
//     }
// };

export const GetStudentInUniversityAPI = async (uniId: string, pageSize: number, pageNo: number, status?: string): Promise<ResponseDTO<ResponseData<StudentRequest>>> => {
    try {
        let response: ResponseDTO<ResponseData<StudentRequest>>;
        if (status != null || undefined) {
            response = await get<ResponseDTO<ResponseData<StudentRequest>>>(`/Students/university/${uniId}?Status=${status}&PageNumber=${pageNo}&PageSize=${pageSize}`);
        } else {
            response = await get<ResponseDTO<ResponseData<StudentRequest>>>(`/Students/university/${uniId}?PageNumber=${pageNo}&PageSize=${pageSize}`);
        }
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

// Types for API response
interface EventSchedule {
    eventId: string;
    eventName: string;
    startDate: string;
    endDate: string;
}

export interface ClubSchedule {
    clubScheduleId: string;
    clubId: string;
    scheduleName: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
    status?: boolean;
}

export interface ClubSchedule2 {
    clubName: string;
    scheduleName: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    startDate: string;
    endDate: string;
    status: boolean;
}

export interface StudentScheduleData {
    userId: string;
    email: string;
    fullname: string;
    eventSchedules: EventSchedule[];
    clubSchedules: ClubSchedule2[];
}

export const GetScheduleStudentByIdAPI = async (userId: string): Promise<ResponseDTO<StudentScheduleData>> => {
    try {
        const response = await get<ResponseDTO<StudentScheduleData>>(`/User/${userId}/schedule`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const GetScheduleClubAPI = async (clubId: string): Promise<ResponseDTO<ResponseData<ClubSchedule>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<ClubSchedule>>>(`/ClubSchedules/Club/${clubId}?PageNumber=1&PageSize=1000`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};