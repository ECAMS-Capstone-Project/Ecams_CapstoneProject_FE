import { get } from "../agent";
import { ResponseDTO } from "../BaseResponse";
import { FieldDTO } from "./RequestClubAPI";

export enum ClubStatusEnum {
    Inactive = 0,
    Active = 1,
    Pending = 2,
    // ... tùy chỉnh thêm
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
}

export const GetAllClubsAPI = async (userId: string, status: string): Promise<ResponseDTO<ClubResponseDTO[]>> => {
    try {
        const response = await get<ResponseDTO<ClubResponseDTO[]>>(`/Clubs/User/${userId}?Status=${status}&PageNumber=1&PageSize=100`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};