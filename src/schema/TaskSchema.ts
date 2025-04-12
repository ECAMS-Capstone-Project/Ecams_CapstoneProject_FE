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
            const now = new Date();
            const [startHour, startMinute] = data.startTimeTime.split(":").map(Number);
            const startDateTime = new Date(data.startTimeDate);
            startDateTime.setHours(startHour, startMinute, 0, 0);

            return startDateTime > now;
        },
        {
            message: "Start time must be in the future",
            path: ["startTimeTime"],
        }
    )
    .refine(
        (data) => {
            const [startHour, startMinute] = data.startTimeTime.split(":").map(Number);
            const [endHour, endMinute] = data.deadlineTime.split(":").map(Number);

            const startDateTime = new Date(data.startTimeDate);
            startDateTime.setHours(startHour, startMinute, 0, 0);

            const endDateTime = new Date(data.deadlineDate);
            endDateTime.setHours(endHour, endMinute, 0, 0);

            return endDateTime > startDateTime;
        },
        {
            message: "Deadline must be after the start time",
            path: ["deadlineTime"],
        }
    );

export type TaskFormValues = z.infer<typeof TaskSchema>;
