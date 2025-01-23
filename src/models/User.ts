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
  
  // TypeScript model for Staffs
  export interface Staff {
    staffId: string; // Primary key
    userId: string; // Foreign key referencing Users table
  };
  