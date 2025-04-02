/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { get, put } from "../agent";
import { ResponseDTO } from "../BaseResponse";

export interface ClubOwnerChangeResponseDTO {
    clubId: string;
    clubName: string;
    owner: ClubMemberResponseDTO;
    requestedPerson: ClubMemberResponseDTO;
}

export interface ClubMemberResponseDTO {
    userId: string;
    studentId: string;
    clubMemberId: string;
    clubRoleName: ClubRoleEnum;
    joinedAt?: Date;
    requestedDate?: Date;
    reason: string;
    leaveReason?: string;
    clubActivityPoint: number;
    leftDate?: Date;
    avatar: string;
    fullname: string;
    email: string;
    status: ClubMemberStatusEnum;
}

export enum ClubRoleEnum {
    CLUB_MEMBER = "CLUB_MEMBER",
    CLUB_OWNER = "CLUB_OWNER",
}

export enum ClubMemberStatusEnum {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export const GetRequestChangeClubOwnerAPI = async (universityId: string): Promise<ResponseDTO<ClubOwnerChangeResponseDTO[]>> => {
    try {
        const response = await get<ResponseDTO<ClubOwnerChangeResponseDTO[]>>(`https://localhost:7021/University/${universityId}/owner-requests`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const AcceptOrDenyOwnerRequestAPI = async (clubId: string, data: { rejectReason: string, isAccepted: boolean }): Promise<ResponseDTO<string>> => {
    try {
        const response = await put<ResponseDTO<string>>(`/Clubs/${clubId}/owner-request`, data);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 404) {
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