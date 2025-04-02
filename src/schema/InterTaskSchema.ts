import { z } from "zod";

export const InterTaskSchema = z.object({
  clubId: z.string().min(1, "Club is required"),
  taskName: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z.coerce.date().min(new Date(), "Start time is required"),
  deadline: z.coerce.date().min(new Date(), "Deadline is required"),
  listEventTaskDetails: z.array(
    z.object({
      detailName: z.string().min(1, "Detail name is required"),
      description: z.string().min(1, "Description is required"),
      startTime: z.coerce.date().min(new Date(), "Start time is required"),
      deadline: z.coerce.date().min(new Date(), "Deadline is required"),
    })
  ),
});

export const subtaskSchema = z.object({
  detailName: z.string().min(1, "Detail name is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z.coerce.date().min(new Date(), "Start time is required"),
  deadline: z.coerce.date().min(new Date(), "Deadline is required"),
});
