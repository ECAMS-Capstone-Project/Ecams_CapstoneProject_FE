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
  eventField: FieldDTO[];
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
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "WAITING";
}
