export interface InterTask {
  eventTaskId: string;
  clubEventId: string;
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
}
