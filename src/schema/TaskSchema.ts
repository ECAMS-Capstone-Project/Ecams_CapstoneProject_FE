import { z } from "zod";

export const TaskSchema = z
    .object({
        clubId: z.string().min(1, "Club ID is required"),
        taskName: z.string().nonempty("Task name is required"),
        description: z.string().nonempty("Description is required"),
        deadlineDate: z.date({
            required_error: "Deadline date is required",
        }),
        deadlineTime: z.string().nonempty("Deadline time is required"),
        startTimeDate: z.date({
            required_error: "Start time date is required",
        }),
        startTimeTime: z.string().nonempty("Start time is required"),
        taskScore: z.preprocess((a) => Number(a), z.number().min(0).max(100)),
        assignAll: z.boolean(),
        selectedMembers: z.array(z.string()),
    })
    .refine(
        (data) => (!data.assignAll ? data.selectedMembers.length > 0 : true),
        {
            message: "Please select at least one student or assign all members",
            path: ["selectedMembers"],
        }
    )
    .refine(
        (data) => (data.assignAll ? data.selectedMembers.length === 0 : true),
        {
            message: "Cannot assign all members and select specific students simultaneously",
            path: ["selectedMembers"],
        }
    )
    .refine(
        (data) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return data.startTimeDate >= today;
        },
        {
            message: "Start date must be today or in the future",
            path: ["startTimeDate"],
        }
    )
    .refine(
        (data) => data.deadlineDate > data.startTimeDate,
        {
            message: "Deadline date must be after the start date",
            path: ["deadlineDate"],
        }
    );

export type TaskFormValues = z.infer<typeof TaskSchema>;
