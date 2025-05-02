import { FieldDTO } from "@/api/club-owner/RequestClubAPI";
import { ClubMemberResponseDTO } from "@/api/representative/RequestChangeOwner";
import { ConditionEvidence } from "@/components/partial/student/club-register/JoinClubDialog";

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
  topEvents: topEvents[];
  clubMembers: ClubMemberResponseDTO[];
  isEventClub: boolean;
}
export interface topEvents {
  eventId: string;
  eventName: string;
  imageUrl: string;
  description: string;
  registeredStartDate: string;
  registeredEndDate: string;
  price: number;
  maxParticipants: number;
  status: string;
  eventType: string;
  numOfFeedbacks: number;
  averageRating: number;
  eventFields: FieldDTO[];
}

export interface ClubJoinedRequest {
  ClubId: string;
  Reason: string;
  UserId: string;
  ConditionEvidences: ConditionEvidence[];
}

export interface isInClubResponse {
  isMember: boolean;
  hasPendingRequest: boolean;
}

export interface AvailableClubResponse {
  clubId: string;
  clubName: string;
  logoUrl: string;
  description: string;
  clubFields: ClubFieldResponseDTO[];
  purpose: string;
  foundingDate: Date;
  contactEmail: string | null;
  contactPhone: string | null;
  websiteUrl: string | null;
  status: string;
  isEventClub: boolean;
  warningCount: number;
}
