import { FieldDTO } from "@/api/club-owner/RequestClubAPI";
import { EventAreas } from "./Area";

export interface Event {
  eventId: string;
  representativeId: string;
  representativeName: string | null;
  clubs: InterClub[];
  eventName: string;
  startDate: Date;
  endDate: Date;
  registeredStartDate: Date;
  registeredEndDate: Date;
  price: number;
  maxParticipants: number;
  status: string;
  registrationStatus: string;
  eventAreas?: EventAreas[];
  feedbacks?: [];
  imageUrl: string;
  description: string;
  walletId?: string;
  eventType: string;
  trainingPoint: number;
  eventFields: FieldDTO[];
  eventRegistrations?: EventRefundDTO[];
  totalRevenue: number;
  universityName: string;
  universityAddress: string;
}
export interface EventRefundDTO {
  refundId: string;
  userId: string;
  email: string;
  fullname: string;
  address: string;
  phonenumber: string;
  gender: string;
  avatar: string;
  refundInforStatus: string;
  refundStatus: string;
}

export interface CheckInInfo {
  email: string;
  fullname: string;
  phonenumber: string;
  universityName: string;
  purchaseDate: Date;
  studentDetailId: string;
  eventName: string;
  startDate: Date;
  endDate: Date;
  price: number;
  clubName: string;
  areaName: string[];
}

export interface InterClub {
  clubId: string;
  clubName: string;
  logoUrl: string;
  description: string;
  purpose: string;
  foundingDate: string;
  contactEmail: string;
  isEventClub: boolean;
  status: string;
  isHost: boolean;
  isEnd: boolean;
}

// Model cho Club Event
export interface InterClubEventDTO {
  clubEventId: string;
  eventId: string;
  eventName: string;
  eventType: string;
  registeredStartDate: Date; // ISO 8601 format
  registeredEndDate: Date; // ISO 8601 format
  price: number;
  maxParticipants: number;
  imageUrl: string;
  description: string;
  numOfParticipants: number;
  trainingPoint: number;
  clubs: InterClub[]; // Danh sách câu lạc bộ liên quan đến sự kiện
  eventAreas?: EventAreas[]; // Các khu vực sự kiện
  status:
    | "ACTIVE"
    | "INACTIVE"
    | "PENDING"
    | "WAITING"
    | "ENDED"
    | "CANCELED"
    | "NOT_STARTED";
  startDate: Date;
  endDate: Date;
}

export interface RefundRequest {
  userId: string;
  eventId: string;
  bankNumber: string;
  bankQR: string;
  bankName: string;
  description: string;
  evidenceRegistration: string;
}

export interface RefundResponseDTO {
  refundId: string;
  eventRegistrationId: string;
  bankNumber: string;
  bankQR: string;
  bankName: string;
  description: string;
  evidenceRegistration: string;
  evidenceRefund: string;
  status: string;
  refundInforStatus: string;
  userId: string;
  email: string;
  fullname: string;
  phonenumber: string;
  gender: string;
}
export interface EventSingleClubTask {
  eventId: string;
  representativeId: string;
  representativeName: string | null;
  clubs: InterClub[];
  eventName: string;
  startDate: Date;
  endDate: Date;
  registeredStartDate: Date;
  registeredEndDate: Date;
  price: number;
  maxParticipants: number;
  status: string;
  registrationStatus: string;
  eventAreas?: EventAreas[];
  feedbacks?: [];
  imageUrl: string;
  description: string;
  walletId?: string;
  eventType: string;
  trainingPoint: number;
  eventFields: FieldDTO[];
  numOfTasks: number;
  clubEventId: string;
}
