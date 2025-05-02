export interface UserAuthDTO {
  userId: string;
  email: string;
  fullname: string;
  avatar: string;
  isVerified: boolean;
  universityId?: string;
  roles: string[];
  representativeId: string;
  universityStatus: string;
  universityName: string;
  phonenumber: string;
  status: string;
  isRecommended: boolean;
  userType: string;
  yearOfStudy: number;
  address: string;
  startDate: Date;
  endDate: Date;
  major: string;
  gender: string;
}
