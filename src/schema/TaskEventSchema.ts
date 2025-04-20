import { z } from "zod";

// Schema cho từng event task detail
export const EventTaskDetailSchema = z.object({
  eventTaskDetailId: z.string(),
  eventTaskId: z.string(),
  detailName: z.string().min(1, "Detail name is required"),
  description: z.string().min(1, "Description is required"),
  startTimeTime: z.string().min(1, "Require"),
  startTimeDate: z.date(),
  deadlineDate: z.date(),
  deadlineTime: z.string().min(1, "Require"),
  status: z.string().min(1, "Require"),
  priority: z.string().min(1, "Require"),
  assignedMembers: z.array(z.string()),
  assignAll: z.boolean(),
});

// Schema cho task chính
export const TaskEventSchema1 = z.object({
  eventTaskId: z.string(),
  clubId: z.string(),
  eventId: z.string(),
  taskName: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  deadlineTime: z.string().min(1, "Require"),
  deadlineDate: z.date(),
  startTimeTime: z.string().min(1, "Require"),
  startTimeDate: z.date(),
  status: z.string().min(1, "Require"),
  eventTaskDetails: z.array(EventTaskDetailSchema),
});

export type TaskEventFormValues = z.infer<typeof EventTaskDetailSchema>;
