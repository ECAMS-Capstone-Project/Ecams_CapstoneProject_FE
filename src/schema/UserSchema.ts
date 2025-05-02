import { z } from "zod";

export const StudentSchema = z.object({
   
  userId: z.string().uuid(),
    email: z.string().email(),
    fullname: z.string().min(1),
    address: z.string().min(1),
    phonenumber: z.string().min(10).max(15),
    status: z.string(),
    roleName: z.string(),
  universityName: z.string().optional(),
  shortName: z.string().optional(),
});

// TypeScript type từ schema
export type Student = z.infer<typeof StudentSchema>;

export const StaffSchema = z.object({
    userId: z.string().uuid(),
    email: z.string().email(),
    fullname: z.string().min(1),
    address: z.string().min(1),
    phonenumber: z.string().min(10).max(15),
    status: z.string(),
    roleName: z.string(),
    universityName: z.string().optional(),
    shortName: z.string().optional(),
  });
  
  export type Staff = z.infer<typeof StaffSchema>;

  export const UserAuthDTOSchema = z.object({
    userId: z.string(),
    email: z.string().email(), // Validate email format
    fullname: z.string(),
    avatar: z.string().url().optional(), // Validate URL format, optional
    isVerified: z.boolean(),
    universityId: z.string().optional(), // Optional field
    roles: z.array(z.string()), // Array of strings
    // Common fields
    phone: z.string().min(10).max(15).optional(),
    address: z.string().optional(),
    // Representative specific fields
    gender: z.enum(["male", "female", "other"]).optional(),
    // Student specific fields
    major: z.string().optional(),
    year: z.number().min(1).max(4).optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  });

