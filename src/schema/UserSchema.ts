import { z } from "zod";

export const StudentSchema = z.object({
    studentId: z.string().uuid(),  // Mã sinh viên, sử dụng UUID
    userId: z.string().uuid(),     // Mã người dùng, cũng là UUID
    universityId: z.string().uuid(), // Mã trường đại học
    major: z.string().min(1, "Major is required"), // Ngành học, không được để trống
    yearOfStudy: z.number().min(1).max(10), // Năm học, giới hạn từ 1 - 10
    startDate: z.string().datetime({ offset: true }), // Ngày bắt đầu, ISO 8601 format
    endDate: z.string().datetime({ offset: true }).nullable(), // Ngày kết thúc có thể null
    imageUrl: z.string().url("Invalid image URL"), // Đường dẫn ảnh hợp lệ
    status: z.boolean(), // Trạng thái (true: Active, false: Inactive)
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
  });
  
  export type Staff = z.infer<typeof StaffSchema>;