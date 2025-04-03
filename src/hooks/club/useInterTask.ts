/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CreateInterTask,
  GetInterTask,
  UpdateInterTask,
} from "@/api/club-owner/InterEventTask";
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
      queryClient.invalidateQueries({ queryKey: ["interTasks"] }); // Tự động refetch danh sách ✅
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

  // const getInterEventDetailQuery = (eventId: string) => {
  //   return useQuery({
  //     queryKey: ["interEventDetail", eventId], // Query key động dựa trên eventId
  //     queryFn: () => GetInterClubEventDetail(eventId), // Gọi API lấy chi tiết sự kiện
  //     enabled: !!eventId, // Chỉ thực hiện khi có eventId

  //   });
  // };

  // const { mutateAsync: approveInterEventMutation, isPending: isApproving } = useMutation({
  //   mutationFn:approveInterEvent,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["interEventDetail"] });
  //   },
  //   onError: (error: any) => {
  //     toast.error(error.response?.data?.message || "Error approving event");
  //   },
  // });

  //   const {mutateAsync: rejectInterEventMutation, isPending: isRejecting} = useMutation({
  //     mutationFn: rejectInterEvent,
  //     onSuccess: () => {
  //       // refetch();
  //       queryClient.invalidateQueries( {queryKey:["interEventDetail"]}); // Tự động refetch danh sách ✅
  //     },
  //     onError: (error: any) => {
  //       toast.error(error.response.data.message || "Error approving event");
  //     },
  //   });

  return {
    tasks: data?.data?.data || [],
    totalPages: data?.data?.totalPages || 1,
    isLoading,
    refetchEvents: refetch,
    createInterEventTask: createInterEventTaskMutation,
    isPending,
    updateInterEventTask: updateInterEventTaskMutation,
    isUpdating,
  };
};
