/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { del, get, patch, post, put } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { FieldDTO } from "./RequestClubAPI";
import { ClubResponse } from "@/models/Club";
import { Task } from "@/models/Task";

export enum ClubStatusEnum {
    Inactive = 0,
    Active = 1,
    Pending = 2,
    // ... tùy chỉnh thêm
}
export interface ClubMemberDTO {
    userId: string;
    studentId: string;
    clubMemberId: string;
    clubRoleName: string;
    joinedAt: string;
    requestedDate: string;
    clubActivityPoint: number;
    leftDate: string | null;
    avatar: string;
    fullname: string;
    email: string;
}

export interface ClubResponseDTO {
    clubId: string;
    clubName: string;
    logoUrl: string;
    description: string;
    purpose: string;
    foundingDate: string;
    contactEmail?: string;
    contactPhone?: string;
    websiteUrl?: string;
    status: ClubStatusEnum;
    clubFields: FieldDTO[];
    clubMembers?: ClubMemberDTO[];
    clubOwnerId: string;
    activityPoints?: number;
}

// Enum cho EventStatus
export enum EventStatusEnum {
    PENDING = 1,
    ACTIVE = 2,
    INACTIVE = 3,
}

// Enum cho EventType
enum EventTypeEnum {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}

// Interface cho Event
export interface EventResponse {
    eventId: string;
    representativeId?: string;
    representativeName?: string;
    clubId?: string;
    clubName?: string;
    eventName: string;
    description: string;
    imageUrl: string;
    startDate: Date;
    endDate: Date;
    registeredStartDate: Date;
    registeredEndDate: Date;
    price: number;
    maxParticipants?: number;
    status: EventStatusEnum;
    eventType: EventTypeEnum;
}

export interface ClubCondition {
    conditionId: string;
    clubId: string;
    conditionName: string;
    conditionContent: string;
    description: string;
}

export interface ClubConditionCreateDTO {
    clubId: string;
    conditionName: string;
    conditionContent: string;
    description: string;
}

export interface ClubConditionUpdateDTO {
    conditionId: string;
    conditionName: string;
    conditionContent: string;
    description: string;
}
export interface ClubMemberRequestDTO {
    clubMemberId: string;
    acceptedBy: string;
    isAccepted: boolean;
    reason: string;
}
export interface ClubRankingDTO {
    clubId: string;
    clubName: string;
    logoUrl: string;
    totalScore: number;
    rank: "EXCELENT" | "GOOD" | "AVERAGE" | "NEED_IMPROVEMENT";
}
export interface ClubRankingDetailDTO {
    clubId: string;
    clubName: string;
    logoUrl: string;
    numOfNewMembers: number;
    newMemberScore: number;
    numOfEvents: number;
    eventScore: number;
    averageEventRating: number;
    eventRatingScore: number;
    averageActivityPoint: number;
    activityScore: number;
    totalScore: number;
    rank: "EXCELENT" | "GOOD" | "AVERAGE" | "NEED_IMPROVEMENT";
}
export const GetAllClubsAPI = async (userId: string, status: string, pageNo: number): Promise<ResponseDTO<ResponseData<ClubResponseDTO>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<ClubResponseDTO>>>(`/Clubs/User/${userId}?Status=${status}&PageNumber=${pageNo}&PageSize=8`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const GetInvitationClubsAPI = async (userId: string, pageNo: number): Promise<ResponseDTO<ResponseData<ClubResponseDTO>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<ClubResponseDTO>>>(`/Clubs/User/${userId}/invitation?PageNumber=${pageNo}&PageSize=8`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const ApproveClubAPI = async (clubId: string, userId: string): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>(`/Clubs/${clubId}/User/${userId}/accept`);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const DenyClubAPI = async (clubId: string, userId: string, stu: any): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>(`/Clubs/${clubId}/User/${userId}/reject`, stu);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const GetProcessClubsAPI = async (universityId: string, pageNo: number): Promise<ResponseDTO<ResponseData<ClubResponseDTO>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<ClubResponseDTO>>>(`/Clubs/university/${universityId}?Status=PROCESSING&PageNumber=${pageNo}&PageSize=8`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const DenyClubCheckingAPI = async (clubId: string, stu: any): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>(`/Clubs/${clubId}/reject`, stu);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const ApproveClubCheckingAPI = async (clubId: string): Promise<ResponseDTO<string>> => {
    try {
        const response = await patch<ResponseDTO<string>>(`/Clubs/${clubId}/accept`);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const GetClubsDetailAPI = async (clubId: string): Promise<ResponseDTO<ClubResponse>> => {
    try {
        const response = await get<ResponseDTO<ClubResponse>>(`/Clubs/${clubId}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const GetMemberInClubsAPI = async (clubId: string, pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<ClubMemberDTO>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<ClubMemberDTO>>>(`/Clubs/${clubId}/members?PageNumber=${pageNo}&PageSize=${pageSize}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const GetTaskInClubsAPI = async (clubId: string, pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Task>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<Task>>>(`/Clubs/${clubId}/tasks?PageNumber=${pageNo}&PageSize=${pageSize}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const GetEventInClubsAPI = async (clubId: string, pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<EventResponse>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<EventResponse>>>(`/Clubs/${clubId}/events?PageNumber=${pageNo}&PageSize=${pageSize}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const GetAllClubCondition = async (clubId: string): Promise<ResponseDTO<ClubCondition[]>> => {
    try {
        const response = await get<ResponseDTO<ClubCondition[]>>(`/Clubs/${clubId}/conditions`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const CreateClubCondition = async (data: ClubConditionCreateDTO): Promise<ResponseDTO<string>> => {
    try {
        const response = await post<ResponseDTO<string>>(`/ClubConditions`, data);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const DeleteClubCondition = async (clubConditionId: string): Promise<ResponseDTO<string>> => {
    try {
        const response = await del<ResponseDTO<string>>(`/ClubConditions/${clubConditionId}`);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const UpdateClubCondition = async (data: ClubConditionUpdateDTO): Promise<ResponseDTO<string>> => {
    try {
        const response = await put<ResponseDTO<string>>(`/ClubConditions/${data.conditionId}`, data);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const GetMemberRequestInClubsAPI = async (clubId: string, pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<ClubMemberDTO>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<ClubMemberDTO>>>(`/Clubs/${clubId}/requests?PageNumber=${pageNo}&PageSize=${pageSize}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const GetTaskMemberInClubsAPI = async (clubId: string, userId: string, pageSize: number, pageNo: number): Promise<ResponseDTO<ResponseData<Task>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<Task>>>(`/Tasks/clubs/${clubId}/User/${userId}?PageNumber=${pageNo}&PageSize=${pageSize}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const ApproveOrDenyRequestJoinClub = async (clubId: string, memberId: string, data: ClubMemberRequestDTO): Promise<ResponseDTO<string>> => {
    try {
        const response = await put<ResponseDTO<string>>(`/Clubs/${clubId}/requests/${memberId}`, data);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const GetClubRankingAPI = async (universityId: string, month: string): Promise<ResponseDTO<ClubRankingDTO[]>> => {
    try {
        const response = await get<ResponseDTO<ClubRankingDTO[]>>(`/Clubs/university/${universityId}/ranking?NumOfMonth=${month}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const GetClubRankingDetailAPI = async (clubId: string, universityId: string, month: string): Promise<ResponseDTO<ClubRankingDetailDTO>> => {
    try {
        const response = await get<ResponseDTO<ClubRankingDetailDTO>>(`/Clubs/${clubId}/university/${universityId}/ranking?months=${month}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};