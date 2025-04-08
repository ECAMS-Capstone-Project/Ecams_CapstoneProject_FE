export interface Report {
    ReportId: string; // ID của báo cáo, kiểu chuỗi
    ReportTitle: string; // Tựa đề của báo cáo
    ReportType: string; // Loại báo cáo (Sales, Feedback, HR, IT, Market, v.v.)
    status: "Active" | "Pending" | "Inactive"; // Trạng thái báo cáo
    UserId: string; // ID của người dùng liên quan
    Content: string; // Nội dung mô tả của báo cáo
    CreatedAt: string; // Ngày giờ tạo báo cáo (ISO 8601 format)
  }
  