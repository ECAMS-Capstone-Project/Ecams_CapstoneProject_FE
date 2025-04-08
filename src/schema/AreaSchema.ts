import { z } from "zod";

export const AreaSchema = z.object({
    areaId: z.string().min(1, "Area ID is required").optional(),
    universityId: z.string().min(1, "University ID is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    status: z.boolean().optional(),
    imageUrl: z
    .union([
      z.string().url("Invalid image URL").optional(),  // Nếu có URL ảnh
      z.instanceof(File).refine((file) => file instanceof File, {
        message: "Image must be a file", // Kiểm tra nếu là file ảnh
      }).optional(),
    ])
});

// TypeScript type từ schema
export type Area = z.infer<typeof AreaSchema>;
