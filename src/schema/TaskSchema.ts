// /schema/TaskSchema.ts
import { z } from "zod"

export const TaskSchema = z
    .object({
        clubId: z.string().min(1, "Club ID is required"),
        taskName: z.string().nonempty("Task name is required"),
        description: z.string().nonempty("Description is required"),

        // Tách deadline thành 2 trường
        deadlineDate: z.date({
            required_error: "Date is required",
        }).refine((d) => d.getTime() > Date.now(), {
            message: "Deadline date must be in the future",
        }),
        deadlineTime: z.string().nonempty("Time is required"),
        // Có thể thêm regex để check format HH:mm

        status: z.enum(["IN_PROGRESS", "COMPLETED", "PENDING"]),
        score: z.number().min(0).max(100),

        assignAll: z.boolean(),
        selectedMembers: z.array(z.string()),
    })
    // Logic: nếu assignAll = false => phải chọn ít nhất 1 student
    .refine(
        (data) => (!data.assignAll ? data.selectedMembers.length > 0 : true),
        {
            message: "Please select at least one student or assign all members",
            path: ["selectedMembers"],
        }
    )
    // Logic: nếu assignAll = true => selectedMembers phải rỗng
    .refine(
        (data) => (data.assignAll ? data.selectedMembers.length === 0 : true),
        {
            message: "Cannot assign all members and select specific students simultaneously",
            path: ["selectedMembers"],
        }
    )

export type TaskFormValues = z.infer<typeof TaskSchema>
