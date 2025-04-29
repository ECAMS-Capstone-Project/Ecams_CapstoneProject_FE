import { z } from "zod";

export const InterTaskSchema = z
  .object({
    clubId: z.string().optional(),
    taskName: z.string().min(1, "Task name is required"),
    description: z.string().min(1, "Description is required"),
    startTime: z
      .date()
      .refine((value) => !isNaN(Date.parse(value.toISOString())), {
        message: "Invalid start time",
      }),
    startTimeTime: z.string().optional(),
    deadline: z
      .date()
      .refine((value) => !isNaN(Date.parse(value.toISOString())), {
        message: "Invalid deadline",
      }),
    deadlineTime: z.string().optional(),
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
        startTimeTime: z.string().optional(),
        deadline: z
          .date()
          .refine((value) => !isNaN(Date.parse(value.toISOString())), {
            message: "Invalid deadline",
          })
          .optional(),
        deadlineTime: z.string().optional(),

        status: z.string().optional(),
        priority: z.string().min(1, "Priority is required"),
        assignedMembers: z
          .array(z.object({ clubMemberId: z.string() }))
          .optional(),
      })
    ),
  })
  .superRefine((data, ctx) => {
    // Chỉ xác thực nếu cả startTime và deadline ở task tổng đều có giá trị
    if (data.startTime && data.deadline) {
      data.listEventTaskDetails.forEach((detail, index) => {
        if (detail.startTime && detail.startTime < data.startTime) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Detail start time must be after or equal to the main task start time",
            path: ["listEventTaskDetails", index, "startTime"],
          });
        }
        if (detail.deadline && detail.deadline > data.deadline) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Detail deadline must be before or equal to the main task deadline",
            path: ["listEventTaskDetails", index, "deadline"],
          });
        }
      });
    }
  });

export const subtaskSchema = z.object({
  status: z.string().min(1, "Status is required"),
  detailName: z.string().min(1, "Detail name is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z.date().min(new Date(), "Start time is required"),
  startTimeTime: z.string().optional(),
  deadline: z.date().min(new Date(), "Deadline is required"),
  deadlineTime: z.string().optional(),
  priority: z.string().min(1, "Priority is required"),
  assignedMembers: z.array(z.object({ clubMemberId: z.string() })).optional(),
});
export const newSubtaskSchema = z.object({
  status: z.string(),
  detailName: z.string().min(1, "Detail name is required"),
  description: z.string().min(1, "Description is required"),
  startTime: z.date().min(new Date(), "Start time is required"),
  startTimeTime: z.string().min(1, "Start time is required"),
  deadline: z.date().min(new Date(), "Deadline is required"),
  deadlineTime: z.string().min(1, "Deadline is required"),
  priority: z.string().min(1, "Priority is required"),
  assignedMemberIds: z.array(z.string()).optional(),
  taskDependencyIds: z.array(z.string()).optional(),
  isDependencyExtended: z.boolean().optional(),
});
