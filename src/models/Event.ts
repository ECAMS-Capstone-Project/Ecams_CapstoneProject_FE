import { EventAreas } from "./Area";

export interface Event {
  eventId: string;
  representativeId: string;
  representativeName: string | null;
  clubId: string | null;
  clubName: string | null;
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
  eventType:string;
  trainingPoint: number;
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