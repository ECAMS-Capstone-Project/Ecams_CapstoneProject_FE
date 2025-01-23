import { z } from "zod";

export const universitySchema = z.object({
  universityId: z.string().uuid(), // UUID đảm bảo là định danh duy nhất
  staffId: z.string().uuid(), // UUID cho staffId
  staffName: z.string().optional(), // Tên staff không bắt buộc
  universityName: z.string().min(1, "University name is required."),
  universityAddress: z.string().optional(), // Địa chỉ không bắt buộc
  status: z.string().min(1, "Status is required."), // Trạng thái bắt buộc
  shortName: z.string().min(1, "Short name is required."),
  contactEmail: z
    .string()
    .email("Invalid email address.")
    .min(1, "Contact email is required."),
  contactPhone: z
    .string()
    .min(10, "Contact phone must be at least 10 characters.")
    .max(15, "Contact phone cannot exceed 15 characters."),
  logoLink: z
    .string()
    .url("Invalid URL.")
    .min(1, "Logo link is required."),
  location: z.string().optional(),
  websiteUrl: z.string().url("Invalid URL.").optional(),
  subscriptionStatus: z.string().min(1, "Subscription status is required."),
  createdDate: z.date().optional(),
  updatedDate: z.date().optional(),
});
// Infer kiểu từ schema
export type University = z.infer<typeof universitySchema>;
