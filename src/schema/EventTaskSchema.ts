import { z } from "zod";

export const EventTaskSchema = z
  .object({
    clubId: z.string().optional(),
    taskName: z.string().min(1, "Task name is required"),
    description: z.string().min(1, "Description is required"),
    startTime: z
      .date()
      .refine((value) => !isNaN(Date.parse(value.toISOString())), {
        message: "Invalid start time",
      }),
    deadline: z
      .date()
      .refine((value) => !isNaN(Date.parse(value.toISOString())), {
        message: "Invalid deadline",
      }),
    startTimeTime: z.string().min(1, "Please select a time"),
    deadlineTime: z.string().min(1, "Please select a time"),
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
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.deadline && data.deadline < data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Deadline must be after Start Time",
        path: ["deadline"],
      });
    }

    data.listEventTaskDetails.forEach((detail, index) => {
      if (detail.startTime && detail.startTime < data.startTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Detail start time must be after task start time",
          path: ["listEventTaskDetails", index, "startTime"],
        });
      }
      if (detail.deadline && detail.deadline > data.deadline) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Detail deadline must be before task deadline",
          path: ["listEventTaskDetails", index, "deadline"],
        });
      }
    });
  });


export const subtaskSchema = z.object({
  status: z.string().min(1, "Status is required"),
  detailName: z.string().min(1, "Detail name is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z.date().min(new Date(), "Start time is required"),
  deadline: z.date().min(new Date(), "Deadline is required"),
});
