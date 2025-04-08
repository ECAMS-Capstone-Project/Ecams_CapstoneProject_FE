enum GenderEnum {
    Male = "Male",
    Female = "Female",
    Other = "Other"
}

enum UserStatusEnum {
    Active = "ACTIVE",
    Inactive = "INACTIVE",
    Pending = "PENDING",
    Checking = "CHECKING"
}

export default interface StudentRequest {
    userId: string;
    email: string;
    fullname: string;
    address: string;
    phonenumber: string;
    gender: GenderEnum;
    status: UserStatusEnum;
    studentId: string;
    universityName: string;
    major: string;
    yearOfStudy: number;
    startDate: Date;
    endDate?: Date; // Optional field
    imageUrl: string;
}
