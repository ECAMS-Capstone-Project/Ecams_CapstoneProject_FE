/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CreateInterTask,
  CreateSubtask,
  DeleteSubtask,
  CreateInterTask2,
  GetAvailableMember,
  GetInterTask,
  GetInterTaskDetail,
  GetInterTaskSubmission,
  GetSubtaskDependency,
  ReviewInterTaskSubmission,
  UpdateInterTask,
  UpdateInterTask2,
  UpdateSubtask,
  UpdateInterTask3,
} from "@/api/club-owner/InterEventTask";
import { GetSubTaskEventAPI } from "@/api/club-owner/TaskAPI";
import { SubtaskCreateRequest, UpdateSubtaskRequest } from "@/models/InterTask";
import { UpdateInterTaskRequest3 } from "@/models/InterTask";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useInterTask = (
  eventId?: string,
  pageNumber?: number,
  pageSize?: number
) => {
  const queryClient = useQueryClient();

  // Fetch danh sách area theo trang
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["interTasks", eventId, pageNumber, pageSize], // Query key động dựa trên uniId, pageNumber và pageSize
    queryFn: () => GetInterTask(eventId || "", pageNumber || 1, pageSize || 5),
    refetchOnMount: true, // Bắt buộc lấy dữ liệu mới sau khi xóa
    refetchOnWindowFocus: false, // Không tự động refetch khi chuyển tab
    enabled: !!eventId, // Chỉ chạy query khi uniId có giá trị
  });

  const { mutateAsync: createInterEventTaskMutation, isPending } = useMutation({
    mutationFn: CreateInterTask,
    onSuccess: () => {
      toast.success("Inter Event Task created successfully!");
      queryClient.invalidateQueries({ queryKey: ["interTasks"], exact: false }); // Tự động refetch danh sách ✅
    },
    onError: (error: any) => {
      console.error("Error:", error.response.data.errors);
      toast.error(error.response.data.message || "An error occurred");
    },
  });
  const { mutateAsync: updateInterEventTaskMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: UpdateInterTask,
      onSuccess: () => {
        toast.success("Inter Event Task updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["interTasks"] }); // Tự động refetch danh sách ✅
        queryClient.invalidateQueries({ queryKey: ["interTaskDetail"] }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        console.error("Error:", error.response.data.errors);
        toast.error(error.response.data.message || "An error occurred");
      },
    });

  const { mutateAsync: updateInterEventTaskMutation2, isPending: isUpdating2 } =
    useMutation({
      mutationFn: UpdateInterTask2,
      onSuccess: () => {
        toast.success("Inter Event Task updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["interTasks"] }); // Tự động refetch danh sách ✅
        queryClient.invalidateQueries({ queryKey: ["interTaskDetail"] }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        console.error("Error:", error.response.data.errors);
        toast.error(error.response.data.message || "An error occurred");
      },
    });

  const { mutateAsync: updateInterEventTaskMutation3, isPending: isUpdating3 } =
    useMutation({
      mutationFn: (params: {
        subtask: UpdateInterTaskRequest3;
        eventTaskDetailId: string;
      }) => UpdateInterTask3(params.subtask, params.eventTaskDetailId),

      onSuccess: () => {
        toast.success("Inter Event Task updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["interTasks"] }); // Tự động refetch danh sách ✅
        queryClient.invalidateQueries({ queryKey: ["interTaskDetail"] }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        console.error("Error:", error.response.data.errors);
        toast.error(error.response.data.message || "An error occurred");
      },
    });

  const { mutateAsync: createInterEventTaskMutation2, isPending: isPending2 } =
    useMutation({
      mutationFn: CreateInterTask2,
      onSuccess: () => {
        toast.success("Inter Event Task created successfully!");
        queryClient.invalidateQueries({
          queryKey: ["interTasks"],
          exact: false,
        }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        console.error("Error:", error.response.data.errors);
        toast.error(error.response.data.message || "An error occurred");
      },
    });
  const { mutateAsync: createSubtaskMutation, isPending: isCreatingSubtask } =
    useMutation({
      mutationFn: (params: {
        subtask: SubtaskCreateRequest;
        eventTaskId: string;
      }) => CreateSubtask(params.subtask, params.eventTaskId),
      onSuccess: () => {
        toast.success("Subtask created successfully!");
        queryClient.invalidateQueries({ queryKey: ["interTasks"] }); // Tự động refetch danh sách ✅
        queryClient.invalidateQueries({ queryKey: ["interTaskDetail"] }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        console.error("Error:", error.response.data.errors);
        toast.error(error.response.data.message || "An error occurred");
      },
    });
  // const GetInterClubEvent = (clubId: string, pageNumber: number, pageSize: number) => {
  //   return useQuery({
  //     queryKey: ["interEvents",clubId,  pageNumber, pageSize], // Query key động dựa trên uniId, pageNumber và pageSize
  //     queryFn: () => GetInterEvent(clubId, pageNumber, pageSize), // Gọi API lấy thông tin Event Club
  //     enabled: !!clubId, // Chỉ thực hiện khi có uniId
  //   });
  // };
  // const GetInterClubEventRequest = (clubId: string, pageNumber: number, pageSize: number) => {
  //   return useQuery({
  //     queryKey: ["interEventRequest",clubId,  pageNumber, pageSize], // Query key động dựa trên uniId, pageNumber và pageSize
  //     queryFn: () => GetInterEventRequest(clubId, pageNumber, pageSize), // Gọi API lấy thông tin Event Club
  //     enabled: !!clubId, // Chỉ thực hiện khi có uniId
  //   });
  // };

  const getInterTaskDetailQuery = (eventTaskId: string) => {
    return useQuery({
      queryKey: ["interTaskDetail", eventTaskId], // Query key động dựa trên eventId
      queryFn: () => GetInterTaskDetail(eventTaskId), // Gọi API lấy chi tiết sự kiện
      enabled: !!eventTaskId, // Chỉ thực hiện khi có eventId
    });
  };
  const getAvailableMemberQuery = (
    clubId: string,
    startTime: string,
    deadline: string,
    priority: string,
    taskId?: string
  ) => {
    return useQuery({
      queryKey: ["availableMember", clubId, startTime, deadline, priority], // Query key động dựa trên eventId
      queryFn: () =>
        GetAvailableMember(clubId, startTime, deadline, priority, taskId), // Gọi API lấy chi tiết sự kiện
      enabled: !!clubId && !!startTime && !!deadline && !!priority, // Chỉ thực hiện khi có eventId
    });
  };
  const getAllSubTask = (
    eventDetailId: string,
    pageNumber: number,
    search: string
  ) => {
    return useQuery({
      queryKey: ["subtasks", eventDetailId, pageNumber, search], // Query key động dựa trên eventId
      queryFn: () => GetSubTaskEventAPI(eventDetailId, pageNumber, search), // Gọi API lấy chi tiết sự kiện
      enabled: true, // Chỉ thực hiện khi có eventId
    });
  };

  const getInterTaskSubmissionQuery = (
    eventTaskDetailId: string,
    memberName?: string,
    status?: string,
    pageSize?: number,
    pageNo?: number
  ) => {
    return useQuery({
      queryKey: [
        "interTaskSubmission",
        eventTaskDetailId,
        memberName,
        status,
        pageSize,
        pageNo,
      ], // Query key động dựa trên eventId
      queryFn: () =>
        GetInterTaskSubmission(
          eventTaskDetailId,
          memberName,
          status,
          pageSize,
          pageNo
        ), // Gọi API lấy chi tiết sự kiện
      enabled: !!eventTaskDetailId,
    });
  };

  const getSubtaskDependencyQuery = (
    eventTaskId: string,
    startTime?: string,
    deadline?: string,
    priority?: string
  ) => {
    return useQuery({
      queryKey: [
        "subtaskDependency",
        eventTaskId,
        startTime,
        deadline,
        priority,
      ], // Query key động dựa trên eventId
      queryFn: () =>
        GetSubtaskDependency(eventTaskId, startTime, deadline, priority), // Gọi API lấy chi tiết sự kiện
      enabled: !!eventTaskId && !!startTime && !!deadline && !!priority,
    });
  };
  const {
    mutateAsync: reviewInterTaskSubmissionMutation,
    isPending: isReviewing,
  } = useMutation({
    mutationFn: ReviewInterTaskSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interTaskSubmission"] });
      toast.success("Submission reviewed successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Error reviewing submission"
      );
    },
  });

  const { mutateAsync: updateSubtaskMutation, isPending: isUpdatingSubtask } =
    useMutation({
      mutationFn: (params: {
        subtask: UpdateSubtaskRequest;
        eventTaskDetailId: string;
        eventTaskId: string;
      }) =>
        UpdateSubtask(
          params.subtask,
          params.eventTaskDetailId,
          params.eventTaskId
        ),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["interTaskDetail"] });
        toast.success("Subtask updated successfully!");
      },
    });
  const { mutateAsync: deleteSubtaskMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: (params: {
        eventTaskDetailId: string;
        eventTaskId: string;
      }) => DeleteSubtask(params.eventTaskDetailId, params.eventTaskId),
      onSuccess: () => {
        // refetch();
        queryClient.invalidateQueries({ queryKey: ["interTasks"] });
        queryClient.invalidateQueries({ queryKey: ["interTaskDetail"] }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        toast.error(error.response.data.message || "Error approving event");
      },
    });

  return {
    tasks: data?.data?.data || [],
    totalPages: data?.data?.totalPages || 1,
    isLoading,
    refetchEvents: refetch,
    createInterEventTask: createInterEventTaskMutation,
    isPending,
    updateInterEventTask: updateInterEventTaskMutation,
    updateInterEventTask2: updateInterEventTaskMutation2,
    isUpdating,
    getInterTaskDetailQuery,
    getAvailableMemberQuery,
    getInterTaskSubmissionQuery,
    reviewInterTaskSubmission: reviewInterTaskSubmissionMutation,
    createInterEventTask2: createInterEventTaskMutation2,
    updateInterEventTask3: updateInterEventTaskMutation3,
    isUpdating3,
    isPending2,
    isReviewing,
    isUpdating2,
    createSubtask: createSubtaskMutation,
    isCreatingSubtask,
    getSubtaskDependencyQuery,
    updateSubtask: updateSubtaskMutation,
    isUpdatingSubtask,
    deleteSubtask: deleteSubtaskMutation,
    isDeleting,
    getAllSubTask,
  };
};
