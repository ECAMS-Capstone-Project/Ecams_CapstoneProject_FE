export type ParticipantStatus = "CHECKED_IN" | "WAITING";

export interface Participant {
  userId: string;
  fullname: string;
  email: string;
  phonenumber: string;
  studentDetailId: string;
  major: string;
  yearOfStudy: number;
  avatar: string;
  universityName: string;
  status: ParticipantStatus;
}