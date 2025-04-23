export interface Task {
  taskId: string;
  taskName: string;
  description: string;
  startTime: string;
  deadline: string;
  status: boolean;
  taskScore: string;
  submissionStatus: string;
  clubMemberId: string;
}
// ... existing code ...

export interface AIRecommendResponse {
  memberId: string;
  fullName: string;
  reason: string;
  currentTask?: {
    taskId: string;
    taskName: string;
    description: string;
    startTime: string;
    deadline: string;
    status: boolean;
  }[];
  relatedTasks: {
    taskId: string;
    taskName: string;
    description: string;
    startTime: string;
    deadline: string;
    status: boolean;
  }[];
}
