export interface Noti {
    notificationId: string;       // Mã thông báo (Primary Key)
    userId?: string | null;       // Mã người dùng (Foreign Key, có thể null nếu thông báo chung)
    message: string;              // Nội dung thông báo
    notificationType: string;     // Loại thông báo (ví dụ: "system", "reminder", "alert", ...)
    createdDate?: Date | null;  // Ngày tạo (có thể null)
    updatedDate?: Date | null;  // Ngày cập nhật (có thể null)
}