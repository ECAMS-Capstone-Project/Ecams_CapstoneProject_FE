import { z } from "zod";

export const TaskSchema = z
    .object({
        clubId: z.string().min(1, "Club ID is required"),
        taskName: z.string().nonempty("Task name is required"),
        description: z.string().nonempty("Description is required"),
        // Deadline được tách thành 2 trường: Date và Time
        deadlineDate: z.date({
            required_error: "Deadline date is required",
        }).refine((d) => d.getTime() > Date.now(), {
            message: "Deadline date must be in the future",
        }),
        deadlineTime: z.string().nonempty("Deadline time is required"),
        // Start time được tách thành 2 trường: Date và Time
        startTimeDate: z.date({
            required_error: "Start time date is required",
        }),
        startTimeTime: z.string().nonempty("Start time is required"),
        // Sử dụng taskScore thay cho score
        taskScore: z.preprocess((a) => Number(a), z.number().min(0).max(100)),
        assignAll: z.boolean(),
        selectedMembers: z.array(z.string()),
    })
    // Nếu assignAll = false => phải chọn ít nhất 1 student
    .refine(
        (data) => (!data.assignAll ? data.selectedMembers.length > 0 : true),
        {
            message: "Please select at least one student or assign all members",
            path: ["selectedMembers"],
        }
    )
    // Nếu assignAll = true => selectedMembers phải rỗng
    .refine(
        (data) => (data.assignAll ? data.selectedMembers.length === 0 : true),
        {
            message: "Cannot assign all members and select specific students simultaneously",
            path: ["selectedMembers"],
        }
    );

export type TaskFormValues = z.infer<typeof TaskSchema>;
