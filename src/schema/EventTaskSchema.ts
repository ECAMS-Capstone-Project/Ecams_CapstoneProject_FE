import { z } from "zod";

const combineDateTime = (date: Date | undefined, time: string | undefined) => {
  if (!date || !time) return undefined;
  const [hour, minute] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hour, minute, 0, 0);
  return combined;
};

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
        priority: z.string().optional(),
      })
    ),
  })
  .superRefine((data, ctx) => {
    const taskStart = combineDateTime(data.startTime, data.startTimeTime);
    const taskDeadline = combineDateTime(data.deadline, data.deadlineTime);

    if (taskStart && taskDeadline && taskDeadline < taskStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Deadline must be after Start Time",
        path: ["deadlineTime"],
      });
    }

    data.listEventTaskDetails.forEach((detail, index) => {
      const detailStart = detail.startTime;
      const detailDeadline = detail.deadline;

      if (detailStart && taskStart && detailStart < taskStart) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Detail start time must be after task start time",
          path: ["listEventTaskDetails", index, "startTime"],
        });
      }

      if (detailDeadline && taskDeadline && detailStart) {
        const isSameDate =
          detailDeadline.toDateString() === data.deadline.toDateString() ||
          detailStart.toDateString() === data.startTime.toDateString();

        if (isSameDate) {
          const taskDeadlineTime = combineDateTime(data.deadline, data.deadlineTime);
          const taskStartTime = combineDateTime(data.startTime, data.startTimeTime);

          if (taskDeadlineTime && detailDeadline && detailDeadline > taskDeadlineTime) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Detail deadline must be before task deadline",
              path: ["listEventTaskDetails", index, "deadline"],
            });
          } else if (taskStartTime && detailStart && detailStart < taskStartTime) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Start time detail must be after task start",
              path: ["listEventTaskDetails", index, "startTime"],
            });
          }
        }
      }
    });
  });

export const subtaskSchema = z.object({
  status: z.string().min(1, "Status is required"),
  detailName: z.string().min(1, "Detail name is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z.date().min(new Date(), "Start time is required"),
  deadline: z.date().min(new Date(), "Deadline is required"),
  priority: z.string()
});
