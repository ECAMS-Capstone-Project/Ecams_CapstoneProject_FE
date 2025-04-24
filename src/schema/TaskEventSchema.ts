import { z } from "zod";

export const EventTaskDetailSchema = z
  .object({
    detailName: z.string().min(1, "Detail name is required"),
    description: z.string().min(1, "Description is required"),
    startTimeTime: z.string().min(1, "Start time is required"),
    startTimeDate: z.date(),
    deadlineDate: z.date(),
    deadlineTime: z.string().min(1, "Deadline time is required"),
    priority: z.string().min(1, "Priority is required"),
    assignedMembers: z.array(z.string()),
    taskDependencyIds: z.array(z.string()).default([])
  })
  .refine((data) => {
    const start = new Date(data.startTimeDate);
    const deadline = new Date(data.deadlineDate);

    const [startHour, startMinute] = data.startTimeTime.split(":").map(Number);
    const [deadlineHour, deadlineMinute] = data.deadlineTime.split(":").map(Number);

    const startDateTime = new Date(start);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const deadlineDateTime = new Date(deadline);
    deadlineDateTime.setHours(deadlineHour, deadlineMinute, 0, 0);

    return deadlineDateTime > startDateTime;
  }, {
    message: "Deadline must be after start time",
    path: ["deadlineTime"],
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
