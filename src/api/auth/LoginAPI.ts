import {
  LoginRequest,
  LoginResponseDTO,
  RefreshTokenRequestDTO,
  RefreshTokenResponseDTO,
} from "@/models/Auth/LoginRequest";
import { ResponseDTO } from "../BaseResponse";
import { get, post, put } from "../agent";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import toast from "react-hot-toast";
import axiosMultipartForm from "../axiosMultipartForm";
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface UserUpdateDTO {
  userId?: string;
  fullname: string;
  address: string;
  phonenumber: string;
  gender: string;
  major: string;
  yearOfStudy: number;
  startDate: string | null;
  endDate: string | null;
}

export const loginAPI = async (
  data: LoginRequest
): Promise<ResponseDTO<LoginResponseDTO>> => {
  try {
    if (data.password.length < 8) {
      toast.error("Password must be greater than or equal to 8 digits.");
      return Promise.reject(
        "Password must be greater than or equal to 8 digits."
      );
    }
    const response = await post<ResponseDTO<LoginResponseDTO>>(
      "/Auth/login",
      data
    );
    return response;
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const getCurrentUserAPI = async (): Promise<
  ResponseDTO<UserAuthDTO>
> => {
  try {
    const response = await get<ResponseDTO<UserAuthDTO>>("/Auth/me");
    return response;
  } catch (error: any) {
    if (error.response) {
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const refreshTokenAPI = async (
  data: RefreshTokenRequestDTO
): Promise<ResponseDTO<RefreshTokenResponseDTO>> => {
  try {
    const response = await post<ResponseDTO<RefreshTokenResponseDTO>>(
      "/Auth/refresh-token",
      data
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const updatePasswordAPI = async (
  userId: string,
  password: string,
  newPassword: string
): Promise<ResponseDTO<string>> => {
  try {
    const data = {
      password: password,
      newPassword: newPassword,
    };
    const response = await put<ResponseDTO<string>>(
      `/User/${userId}/change-password`,
      data
    );
    return response;
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const updateUserInfoAPI = async (
  userId: string,
  data: UserUpdateDTO
): Promise<ResponseDTO<string>> => {
  try {
    data.userId = userId;
    const response = await put<ResponseDTO<string>>(`/User/${userId}`, data);
    return response;
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const updateAvatarAPI = async (
  userId: string,
  data: FormData
): Promise<ResponseDTO<string>> => {
  try {
    const response = await axiosMultipartForm.put(
      `/User/${userId}/change-avatar`,
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};
