/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { get, post, put } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";

export interface TaskDetailDTO {
    taskId: string;
    taskName: string;
    description: string;
    startTime: string; // ISO date string
    deadline: string;  // ISO date string
    taskScore: number;
    creator: MemberInTaskDTO;
    status: boolean;
    assignedMember: MemberInTaskDTO[];
}

export interface MemberInTaskDTO {
    userId: string;
    studentId: string;
    clubMemberId: string;
    clubRoleName: string;
    joinedAt: string;      // ISO date string
    requestedDate: string; // ISO date string
    clubActivityPoint: number;
    leftDate: string | null;
    avatar: string;
    fullname: string;
    email: string;
}

export type UserTaskStatusEnum = "ON_GOING" | "COMPLETED" | "REVIEWING" | "OVERDUE";

export interface StudentSubmission {
    taskId: string;
    clubMemberId: string;
    memberEmail: string;
    memberName: string;
    studentSubmission: string;
    submissionDate: string; // ISO date string
    submissionScore: number;
    taskScore: number;
    comment: string;
    reviewer: string | null;
    status: UserTaskStatusEnum;
}

export interface ReviewSubmissionRequest {
    taskId: string;
    clubMemberId: string;
    comment: string;
    submissionScore: number;
    reviewedBy: string;
}

export interface StudentSubmissionRequest {
    taskId: string;
    clubMemberId: string;
    studentSubmission: string;
}

export interface CreateTaskRequest {
    clubId: string;
    createdBy: string;
    taskName: string;
    description: string;
    startTime: string; // ISO date string
    deadline: string;  // ISO date string
    taskScore: number;
    assignedMembers: AssignedMember[];
}

export interface UpdateTaskRequest {
    taskId: string;
    status: boolean;
    clubId: string;
    taskName: string;
    description: string;
    startTime: string; // ISO date string
    deadline: string;  // ISO date string
    taskScore: number;
    assignedMembers: AssignedMember[];
}

export interface AssignedMember {
    clubMemberId: string;
}

export interface TaskDetailForStudent {
    taskId: string;
    taskName: string;
    description: string;
    startTime: string;        // ISO date string
    deadline: string;         // ISO date string
    taskStatus: boolean;
    studentSubmission: string;
    taskScore: number;
    submissionScore: number;
    submissionDate: string;   // ISO date string
    comment: string | null;
    creator: MemberInTaskDTO;
    reviewer: MemberInTaskDTO | null;
    submissionStatus: UserTaskStatusEnum;
}

export const GetTaskDetail = async (taskId: string): Promise<ResponseDTO<TaskDetailDTO>> => {
    try {
        const response = await get<ResponseDTO<TaskDetailDTO>>(`/Tasks/${taskId}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const GetMemberSubmission = async (taskId: string): Promise<ResponseDTO<ResponseData<StudentSubmission>>> => {
    try {
        const response = await get<ResponseDTO<ResponseData<StudentSubmission>>>(`/Tasks/${taskId}/submissions?PageNumber=1&PageSize=10`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const SendReviewSubmission = async (data: ReviewSubmissionRequest): Promise<ResponseDTO<string>> => {
    try {
        const response = await put<ResponseDTO<string>>(`/Tasks/${data.taskId}/review`, data);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 404) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 500) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const CreateTaskToStudent = async (data: CreateTaskRequest): Promise<ResponseDTO<string>> => {
    try {
        const response = await post<ResponseDTO<string>>(`/Tasks`, data);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 404) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const GetTaskDetailByMember = async (taskId: string, memberId: string): Promise<ResponseDTO<TaskDetailForStudent>> => {
    try {
        const response = await get<ResponseDTO<TaskDetailForStudent>>(`/Tasks/${taskId}/member/${memberId}`);
        return response; // Trả về toàn bộ phản hồi
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error in UniversityList API call:", error.response || error);
        throw error;
    }
};

export const SendStudentSubmission = async (data: StudentSubmissionRequest): Promise<ResponseDTO<string>> => {
    try {
        const response = await put<ResponseDTO<string>>(`/Tasks/${data.taskId}/submit`, data);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 404) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 500) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const UpdateTaskAPI = async (data: UpdateTaskRequest): Promise<ResponseDTO<string>> => {
    try {
        const response = await put<ResponseDTO<string>>(`/Tasks/${data.taskId}`, data);
        return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 404) {
            toast.error(error.response.data.message);
        } else if (error.response.status == 500) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};
