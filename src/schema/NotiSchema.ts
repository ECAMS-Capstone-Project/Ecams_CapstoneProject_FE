import { z } from "zod";

export const NotificationSchema = z.object({
    // notificationId: z.string().uuid(),  // Mã thông báo (UUID)
    userId: z.string().uuid().optional(),  // Mã người dùng (có thể null nếu là thông báo chung)
    message: z.string().min(1, "Message is required"), // Nội dung thông báo (không được để trống)
    notificationType:  z.string().min(1, "Type is required"), // Loại thông báo
    createdDate: z.date().optional(), // Ngày tạo (ISO format, có thể null)
    updatedDate: z.date().optional(), // Ngày cập nhật (ISO format, có thể null)
});

// TypeScript type từ schema
export type Notification = z.infer<typeof NotificationSchema>;
