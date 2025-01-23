export interface Package {
    PackageId: string; // ID duy nhất của package
    Name: string; // Tên của package
    CreatedAt: string; // Ngày tạo package
    UpdatedAt: string; // Ngày cập nhật package
    CreatedBy: string; // Người tạo package
    UpdatedBy: string; // Người cập nhật package
    Price: number; // Giá của package
    Status: "Active" | "Inactive"; // Trạng thái của package
    Duration: number; // Thời gian hiệu lực (tính bằng ngày)
    Description: string; // Mô tả về package
    EndOfSupportDate: string; // Ngày kết thúc hỗ trợ
  }

  export interface PackageDetail {
    PackageServiceId: string; // ID duy nhất của dịch vụ package
    PackageId: string; // ID của package liên quan
    Value: string; // Giá trị của dịch vụ (ví dụ: "10GB Storage")
    PackageType: string; // Loại package (Basic, Premium, etc.)
    Status: "Active" | "Inactive"; // Trạng thái của dịch vụ
    UpdatedAt: string; // Ngày cập nhật dịch vụ
  }
  