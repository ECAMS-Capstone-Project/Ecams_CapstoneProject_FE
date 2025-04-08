export interface Feedback {
  feedbackId: string;
  studentId: string;
  fullname: string;
  content: string;
  rating: number;
  status: boolean;
}

export interface FeedbackRequest {
  studentId: string;
  eventId: string;
  content: string;
  rating: number;
}
