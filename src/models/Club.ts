interface ClubFieldResponseDTO {
    fieldId: string;
    fieldName: string;
    assignedDate: Date;
}

interface SocialMediaLinkResponseDTO {
    socialId: string;
    platform: string;
    url: string;
}

export interface ClubResponse {
    clubId: string;
    clubName: string;
    logoUrl: string;
    description: string;
    purpose: string;
    foundingDate: Date;
    contactEmail?: string | null;
    contactPhone?: string | null;
    websiteUrl?: string | null;
    numOfMems: number;
    numOfEvents: number;
    clubOwnerName: string;
    clubFields: ClubFieldResponseDTO[];
    socialMediaLinks: SocialMediaLinkResponseDTO[];
    clubOwnerId: string;
}

export interface ClubJoinedRequest {
    clubId: string;
    reason: string; 
    userId: string;
}

export interface isInClubResponse {
    isMember: boolean;
    hasPendingRequest: boolean;
}