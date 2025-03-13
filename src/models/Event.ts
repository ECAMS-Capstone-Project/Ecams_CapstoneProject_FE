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
  eventAreas?: EventAreas[];
  feedbacks?: [];
  imageUrl: string;
  description: string;
  walletId?: string;
  eventType:string;
}
