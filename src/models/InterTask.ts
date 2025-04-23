export interface InterTask {
  eventTaskId: string;
  clubEventId: string;
  clubId: string;
  clubName: string;
  taskName: string;
  description: string;
  startTime: Date;
  deadline: Date;
  status: string;
  createdBy: string;
  completionPercentage: number;
  eventTaskDetails: EventTaskDetail[];
}

export interface EventTaskDetail {
  eventTaskDetailId: string;
  eventTaskId: string;
  detailName: string;
  description: string;
  startTime: Date;
  deadline: Date;
  status: string;
  priority: string;
  assignedMembers: {
    clubMemberId: string;
  }[];
}

export interface CreateInterTaskRequest {
  clubId: string;
  eventId: string;
  taskName: string;
  description: string;
  startTime: Date;
  deadline: Date;
  createdBy: string;
  listEventTaskDetails: CreateInterTaskDetailRequest[];
}
export interface CreateInterTaskDetailRequest {
  detailName: string;
  description: string;
  startTime: Date;
  deadline: Date;
  priority: string;
}

export interface UpdateInterTaskRequest {
  eventTaskId: string;
  clubId: string;
  eventId: string;
  taskName: string;
  description: string;
  startTime: Date;
  deadline: Date;
  status: string;
  eventTaskDetails: UpdateInterTaskDetailRequest[];
}
export interface UpdateInterTaskDetailRequest {
  eventTaskDetailId?: string;
  detailName: string;
  description: string;
  startTime: Date;
  deadline: Date;
  status: string;
  priority: string;
  assignedMembers?: {
    clubMemberId: string;
  }[];
}

export interface AvailableMember {
  userId: string;
  clubMemberId: string;
  email: string;
  fullName: string;
  studentId: string;
  clubActivityPoint: number;
  reason?: string;
  currentTasks?: {
    eventTaskDetailId: string;
    eventTaskId: string;
    clubMemberId: string;
    detailName: string;
    description: string;
    startTime: string;
    deadline: string;
    submissionDate: string | null;
    comment: string | null;
    submissionScore: number;
    status: string;
  }[];
  relatedTasks?: [];
}

export interface AIRecommend {
  clubId: string;
  taskName: string;
  taskDescription: string;
  startTime: string;
  endTime: string;
  priority: string;
  taskId?: string;
}

export interface InterTaskSubmission {
  clubMemberId: string;
  comment: string | null;
  eventTaskDetailId: string;
  memberEmail: string;
  memberName: string;
  reviewer: {
    userId: string;
    studentId: string;
    clubMemberId: string;
    clubRoleName: string;
    joinedAt: string;
    requestedDate: string;
    reason: string | null;
    leaveReason: string | null;
    clubActivityPoint: number;
    leftDate: string | null;
    avatar: string;
    fullname: string;
    email: string;
    status: string;
  } | null;
  status: string;
  studentSubmission: string | null;
  submissionDate: string;
  submissionFile: string[];
  submissionScore: number;
  taskScore: number;
}

export interface ReviewInterTaskSubmissionRequest {
  eventTaskDetailId: string;
  clubMemberId: string;
  comment: string;
  submissionScore: number;
  reviewedBy: string;
}

export interface UpdateInterTaskRequest2 {
  eventTaskId: string;
  clubId: string;
  eventId: string;
  taskName: string;
  description: string;
  startTime: string;
  deadline: string;
  status: string;
  eventTaskDetails: UpdateInterTaskDetailRequest2[];
}
export interface UpdateInterTaskDetailRequest2 {
  eventTaskDetailId: string;
  detailName: string;
  description: string;
  startTime: string;
  deadline: string;
  status: string;
}
export interface EventTaskDetail2 {
  eventTaskDetailId: string;
  eventTaskId: string;
  detailName: string;
  description: string;
  startTime: string;
  deadline: string;
  status: string;
  priority: string
}