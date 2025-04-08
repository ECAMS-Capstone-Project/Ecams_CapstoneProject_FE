import { z } from "zod"

export const TaskSchema = z.object({
    clubId: z.string().nonempty("Club ID is required"),
    taskName: z.string().nonempty("Task Name is required"),
    description: z.string().nonempty("Description is required"),
    deadline: z.date({
        required_error: "Deadline is required",
    }),
    status: z.enum(["IN_PROGRESS", "COMPLETED", "PENDING"], {
        errorMap: () => ({ message: "Status must be one of these: IN_PROGRESS, COMPLETED, or PENDING" }),
    }),
})
