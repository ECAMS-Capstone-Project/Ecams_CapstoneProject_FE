import { GenderEnum } from "@/lib/GenderEnum";

export interface StaffRegisterRequest {
    email: string;
    fullname: string;
    gender: GenderEnum;
    address: string;
    phonenumber?: string;
    password: string;
}

