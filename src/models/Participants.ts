export type ParticipantStatus = "CHECKED_IN" | "WAITING";

export interface Participant {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  studentId: string;
  avatar?: string;
  registrationDate: Date;
  status: ParticipantStatus;
}