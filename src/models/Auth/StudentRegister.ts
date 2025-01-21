export interface StudentRegisterRequest {
    fullName: string;
    studentId: string;
    email: string;
    phoneNumber: string;
    password: string;
    universityId: string;
    yearStudy: string;
    address: string;
    file: File | null;
    major: string;
    startDate: string;
    endDate: string;
    gender: string;
}