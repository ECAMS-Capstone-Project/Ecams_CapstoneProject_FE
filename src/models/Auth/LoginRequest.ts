// LoginResponseDTO.ts

import { UserAuthDTO } from "./UserAuth";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    user: UserAuthDTO;
    accessToken: string | null;
    refreshToken: string | null;
}

export interface RefreshTokenResponseDTO {
    accessToken: string | null;
    refreshToken: string | null;
}

export interface RefreshTokenRequestDTO {
    refreshToken: string;
}
