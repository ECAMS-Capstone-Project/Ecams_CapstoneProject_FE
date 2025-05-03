/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import { get, patch, post, put } from "../agent";
import { ResponseData, ResponseDTO } from "../BaseResponse";
import { EventTaskDetail } from "@/models/InterTask";
import axiosMultipartForm from "../axiosMultipartForm";
import { EventSingleClubTask } from "@/models/Event";

export interface TaskDetailDTO {
  taskId: string;
  taskName: string;
  description: string;
  startTime: string; // ISO date string
  deadline: string; // ISO date string
  taskScore: number;
  creator: MemberInTaskDTO;
  status: boolean;
  assignedMember: MemberInTaskDTO[];
  submissions: Submission[];
}

export interface MemberInTaskDTO {
  userId: string;
  studentId: string;
  clubMemberId: string;
  clubRoleName: string;
  joinedAt: string; // ISO date string
  requestedDate: string; // ISO date string
  clubActivityPoint: number;
  leftDate: string | null;
  avatar: string;
  fullname: string;
  email: string;
}

export type UserTaskStatusEnum =
  | "ON_GOING"
  | "COMPLETED"
  | "REVIEWING"
  | "OVERDUE"
  | "NOT_STARTED";

export interface StudentSubmission {
  userId: string;
  studentId: string | null;
  clubMemberId: string;
  clubRoleName: string;
  joinedAt: string;
  requestedDate: string;
  reason: string;
  leaveReason: string | null;
  clubActivityPoint: number;
  leftDate: string | null;
  avatar: string;
  fullname: string;
  email: string;
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
  listSubmissions: string[];
}

export interface CreateTaskRequest {
  clubId: string;
  createdBy: string;
  taskName: string;
  description: string;
  startTime: string; // ISO date string
  deadline: string; // ISO date string
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
  deadline: string; // ISO date string
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
  startTime: string; // ISO date string
  deadline: string; // ISO date string
  taskStatus: boolean;
  studentSubmission: string;
  taskScore: number;
  submissionScore: number;
  submissionDate: string; // ISO date string
  comment: string | null;
  creator: MemberInTaskDTO;
  reviewer: MemberInTaskDTO | null;
  submissionStatus: UserTaskStatusEnum;
}

export interface Submission {
  taskId: string;
  clubMemberId: string;
  memberEmail: string;
  memberName: string;
  studentSubmission: string;
  submissionDate: string;
  submissionScore: number;
  taskScore: number;
  comment: string | null;
  reviewer: string | null;
  status: string;
  submissionFile: string[];
}

export interface EventSubmissionTaskDetail {
  eventTaskDetailId: string;
  clubMemberId: string;
  memberEmail: string;
  memberName: string;
  studentSubmission: string | null;
  submissionDate: string;
  submissionScore: number;
  submissionFile: string[];
  taskScore: number;
  comment: string | null;
  reviewer: MemberInTaskDTO | null;
  status: string;
}

export interface SubmissionReviewDTO {
  eventTaskDetailId: string;
  clubMemberId: string;
  comment: string;
  submissionScore: number;
  reviewedBy: string;
}

export const GetTaskDetail = async (
  taskId: string
): Promise<ResponseDTO<TaskDetailDTO>> => {
  try {
    const response = await get<ResponseDTO<TaskDetailDTO>>(`/Tasks/${taskId}`);
    return response; // Trả về toàn bộ phản hồi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const GetMemberSubmission = async (
  taskId: string
): Promise<ResponseDTO<ResponseData<StudentSubmission>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<StudentSubmission>>>(
      `/Tasks/${taskId}/submissions?PageNumber=1&PageSize=10`
    );
    return response; // Trả về toàn bộ phản hồi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const SendReviewSubmission = async (
  data: ReviewSubmissionRequest
): Promise<ResponseDTO<string>> => {
  try {
    const response = await put<ResponseDTO<string>>(
      `/Tasks/${data.taskId}/review`,
      data
    );
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 404) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 500) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const CreateTaskToStudent = async (
  data: CreateTaskRequest
): Promise<ResponseDTO<string>> => {
  try {
    const response = await post<ResponseDTO<string>>(`/Tasks`, data);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 404) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const GetTaskDetailByMember = async (
  taskId: string,
  memberId: string
): Promise<ResponseDTO<TaskDetailForStudent>> => {
  try {
    const response = await get<ResponseDTO<TaskDetailForStudent>>(
      `/Tasks/${taskId}/member/${memberId}`
    );
    return response; // Trả về toàn bộ phản hồi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const SendStudentSubmission = async (
  taskId: string,
  data: FormData
): Promise<ResponseDTO<string>> => {
  try {
    const response = await axiosMultipartForm.put(
      `/Tasks/${taskId}/submit`,
      data
    );
    const apiResponse = response.data as ResponseDTO<string>;
    return apiResponse;
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 404) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 500) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const UpdateTaskAPI = async (
  data: UpdateTaskRequest
): Promise<ResponseDTO<string>> => {
  try {
    const response = await put<ResponseDTO<string>>(
      `/Tasks/${data.taskId}`,
      data
    );
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 404) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 500) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const GetMemberSubmissionTaskEvent = async (
  eventDetailId: string,
  pageNumber: number
): Promise<ResponseDTO<ResponseData<EventSubmissionTaskDetail>>> => {
  try {
    const response = await get<
      ResponseDTO<ResponseData<EventSubmissionTaskDetail>>
    >(
      `/EventTask/EventTaskDetail/${eventDetailId}/submissions?PageNumber=${pageNumber}&PageSize=5`
    );
    return response; // Trả về toàn bộ phản hồi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const GetSubTaskEventAPI = async (
  eventDetailId: string,
  pageNumber: number,
  search: string,
  pageSize: number
): Promise<ResponseDTO<ResponseData<EventTaskDetail>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<EventTaskDetail>>>(
      `/EventTask/EventTask/${eventDetailId}?Search=${search}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response; // Trả về toàn bộ phản hồi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const GetSubTaskEventByUserAPI = async (
  eventDetailId: string,
  pageNumber: number,
  search: string,
  userId: string,
  pageSize: number
): Promise<ResponseDTO<ResponseData<EventTaskDetail>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<EventTaskDetail>>>(
      `/EventTask/${eventDetailId}/User/${userId}?Search=${search}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response; // Trả về toàn bộ phản hồi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};

export const SubmitTaskByStudent = async (
  clubMemberId: string,
  eventTaskDetailId: string,
  studentSubmission: string,
  data: FormData
): Promise<ResponseDTO<string>> => {
  try {
    const response = await axiosMultipartForm.put(
      `/EventTask/submit?ClubMemberId=${clubMemberId}&EventTaskDetailId=${eventTaskDetailId}&StudentSubmission=${studentSubmission}`,
      data
    );
    const apiResponse = response.data as ResponseDTO<string>;
    return apiResponse;
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 404) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 500) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const GradeStudentTaskAPI = async (
  data: SubmissionReviewDTO
): Promise<ResponseDTO<string>> => {
  try {
    const response = await put<ResponseDTO<string>>(`/EventTask/review`, data);
    return response; // Trả về toàn bộ phản hồi
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 404) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 500) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const EndOneEventAPI = async (
  clubId: string,
  eventId: string
): Promise<ResponseDTO<string>> => {
  try {
    const response = await patch<ResponseDTO<string>>(
      `/InterClub/Club/${clubId}/Event/${eventId}/end`
    );
    return response;
  } catch (error: any) {
    if (error.response.status == 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 404) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    } else if (error.response.status == 500) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message || "API Error");
    }
    if (error.response) {
      toast.error(error.response.data.message);
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error");
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network error. Please try again later.");
    }
  }
};

export const GetEventSingleTask = async (
  userId: string,
  pageNumber: number,
  pageSize: number,
  search: string,
  status: string
): Promise<ResponseDTO<ResponseData<EventSingleClubTask>>> => {
  try {
    const response = await get<ResponseDTO<ResponseData<EventSingleClubTask>>>(
      `/Event/user/${userId}/event-tasks?EventName=${search}&EventStatus=${status}&PageNumber=${pageNumber}&PageSize=${pageSize}`
    );
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in UniversityList API call:", error.response || error);
    throw error;
  }
};
