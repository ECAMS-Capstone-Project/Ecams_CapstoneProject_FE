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
      universityName?:string,
      shortName?:string
    
  }
  // TypeScript model for Staffs
  export interface Staff {
    staffId: string; // Primary key
    userId: string; // Foreign key referencing Users table
  };
  export interface Student {
   
    userId: string;          // Mã người dùng (Foreign Key liên kết với bảng Users)
    email: string;    // Mã trường đại học (Foreign Key liên kết với bảng UniversityInformation)
    fullname: string;           // Ngành học
    address: string;     // Năm học (sử dụng number vì FLOAT trong SQL có thể map sang number trong TypeScript)
    phonenumber: string;       // Ngày bắt đầu học (ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ)
    roleName: string;        // URL ảnh đại diện của sinh viên
    status: string;         // Trạng thái (true: Active, false: Inactive)
    universityName?:string,
    shortName?:string
}
 

export interface Role {
  roleId: string;
  roleName: string;
  userRole?: string;
}


export interface UserSchedule{
  userId: string;
  email: string;
  fullname: string;
  eventSchedules: EventSchedule[];
  clubSchedules: ClubSchedule[];
}

export interface EventSchedule{
  eventId: string;
  eventName: string;
  startDate: Date;
  endDate: Date;      
      }

export interface ClubSchedule{
  clubName: string;
  scheduleName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  status: boolean;
}
