export interface UserAuthDTO {
    userId: string;
    email: string;
    fullname: string;
    avatar: string;
    isVerified: boolean;
    universityId?: string;
    roles: string[];
    staffId: string;
    universityStatus: string;
    universityName: string
    phonenumber: string
}
