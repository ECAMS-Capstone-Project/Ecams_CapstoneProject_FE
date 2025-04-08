import { z } from "zod";

export const InterTaskSchema = z.object({
  clubId: z.string().optional(),
  taskName: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z
    .date()
    .refine((value) => !isNaN(Date.parse(value.toISOString())), {
      message: "Invalid start time",
    })
    .optional(),
  deadline: z
    .date()
    .refine((value) => !isNaN(Date.parse(value.toISOString())), {
      message: "Invalid deadline",
    })
    .optional(),
  status: z.string().optional(),
  listEventTaskDetails: z.array(
    z.object({
      detailName: z.string().min(1, "Detail name is required"),
      description: z.string().min(1, "Description is required"),
      startTime: z
        .date()
        .refine((value) => !isNaN(Date.parse(value.toISOString())), {
          message: "Invalid start time",
        })
        .optional(),
      deadline: z
        .date()
        .refine((value) => !isNaN(Date.parse(value.toISOString())), {
          message: "Invalid deadline",
        })
        .optional(),
      status: z.string().optional(),
    })
  ),
});

export const subtaskSchema = z.object({
  status: z.string().min(1, "Status is required"),
  detailName: z.string().min(1, "Detail name is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z.date().min(new Date(), "Start time is required"),
  deadline: z.date().min(new Date(), "Deadline is required"),
});
