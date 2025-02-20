import { GenderEnum } from "@/lib/GenderEnum";

export interface RepresentativeRegisterRequest {
    email: string;
    fullname: string;
    gender: GenderEnum;
    address: string;
    phonenumber?: string;
    password: string;
}

