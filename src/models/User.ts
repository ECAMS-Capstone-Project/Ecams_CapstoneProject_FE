// TypeScript model for Users
export interface User  {
    userId: string; // Primary key
    email: string; // User email
    fullname: string; // Full name
    address: string; // Address
    phonenumber: string; // Phone number
    gender: string; // Gender
    avatar: string; // Avatar link
    passwordHash: Uint8Array; // Password hash (binary)
    passwordSalt: Uint8Array; // Password salt (binary)
    status: string; // Account status
    isVerified: boolean; // Verification status
  };

  export interface getStaff{
  
      userId: string;
      email: string;
      fullname: string;
      address: string;
      phonenumber: string;
      status: string;
      roleName: string;
    
  }
  // TypeScript model for Staffs
  export interface Staff {
    staffId: string; // Primary key
    userId: string; // Foreign key referencing Users table
  };
  export interface Student {
    studentId: string;       // Mã sinh viên (Primary Key)
    userId: string;          // Mã người dùng (Foreign Key liên kết với bảng Users)
    universityId: string;    // Mã trường đại học (Foreign Key liên kết với bảng UniversityInformation)
    major: string;           // Ngành học
    yearOfStudy: number;     // Năm học (sử dụng number vì FLOAT trong SQL có thể map sang number trong TypeScript)
    startDate: Date;       // Ngày bắt đầu học (ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ)
    endDate?: Date | null; // Ngày kết thúc học (Có thể null)
    imageUrl: string;        // URL ảnh đại diện của sinh viên
    status: boolean;         // Trạng thái (true: Active, false: Inactive)
}

export interface Role {
  roleId: string;
  roleName: string;
  userRole?: string;
}

