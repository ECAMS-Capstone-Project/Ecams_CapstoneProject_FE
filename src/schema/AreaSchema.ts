import { z } from "zod";

export const AreaSchema = z.object({
    areaId: z.string().min(1, "Area ID is required").optional(),
    universityId: z.string().min(1, "University ID is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    status: z.boolean().optional(),
    imageUrl: z.union([
      z
        .string()
        .url("Invalid image URL")
        .optional()
        .refine((val) => !!val, { message: "Image is required." }),
      z
        .instanceof(File)
        .refine((file) => file.type.startsWith("image/"), {
          message: "Uploaded file must be an image",
        }),
    ])
});

// TypeScript type từ schema
export type Area = z.infer<typeof AreaSchema>;
