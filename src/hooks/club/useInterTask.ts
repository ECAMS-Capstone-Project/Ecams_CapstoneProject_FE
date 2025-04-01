/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { approveInterEvent, createInterClubEvent, GetInterClubEventDetail, GetInterEvent, GetInterEventRequest, rejectInterEvent } from "@/api/club-owner/ClubEvent";
import { GetInterTask } from "@/api/club-owner/InterEventTask";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useInterTask = (eventId?: string,pageNumber?: number, pageSize?: number) => {
  const queryClient = useQueryClient();

  // Fetch danh sách area theo trang
  const { data, isLoading, refetch } = useQuery({

    queryKey: ["interTasks", eventId, pageNumber, pageSize], // Query key động dựa trên uniId, pageNumber và pageSize
    queryFn: () => GetInterTask(eventId || "", pageNumber || 1, pageSize || 5),
    refetchOnMount: true, // Bắt buộc lấy dữ liệu mới sau khi xóa
    refetchOnWindowFocus: false, // Không tự động refetch khi chuyển tab
    enabled: !!eventId, // Chỉ chạy query khi uniId có giá trị
  });
  const {mutateAsync:createInterClubEventMutation, isPending} = useMutation({
    mutationFn: createInterClubEvent,
    onSuccess: () => {
      toast.success("Event created successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] }); // Tự động refetch danh sách ✅
    },
    onError: (error: any) => {
      console.error("Error:", error.response.data.errors);
      toast.error(error.response.data.message || "An error occurred");
    },
  });

  const GetInterClubEvent = (clubId: string, pageNumber: number, pageSize: number) => {
    return useQuery({
      queryKey: ["interEvents",clubId,  pageNumber, pageSize], // Query key động dựa trên uniId, pageNumber và pageSize
      queryFn: () => GetInterEvent(clubId, pageNumber, pageSize), // Gọi API lấy thông tin Event Club
      enabled: !!clubId, // Chỉ thực hiện khi có uniId
    });
  };
  const GetInterClubEventRequest = (clubId: string, pageNumber: number, pageSize: number) => {
    return useQuery({
      queryKey: ["interEventRequest",clubId,  pageNumber, pageSize], // Query key động dựa trên uniId, pageNumber và pageSize
      queryFn: () => GetInterEventRequest(clubId, pageNumber, pageSize), // Gọi API lấy thông tin Event Club
      enabled: !!clubId, // Chỉ thực hiện khi có uniId
    });
  };

  const getInterEventDetailQuery = (eventId: string) => {
    return useQuery({
      queryKey: ["interEventDetail", eventId], // Query key động dựa trên eventId
      queryFn: () => GetInterClubEventDetail(eventId), // Gọi API lấy chi tiết sự kiện
      enabled: !!eventId, // Chỉ thực hiện khi có eventId
   
    });
  };

  const { mutateAsync: approveInterEventMutation, isPending: isApproving } = useMutation({
    mutationFn:approveInterEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interEventDetail"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error approving event");
    },
  });
  
  
    const {mutateAsync: rejectInterEventMutation, isPending: isRejecting} = useMutation({
      mutationFn: rejectInterEvent,
      onSuccess: () => {
        // refetch();
        queryClient.invalidateQueries( {queryKey:["interEventDetail"]}); // Tự động refetch danh sách ✅
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
   createInterClubEvent: createInterClubEventMutation,
   isPending,
   GetInterClubEvent,
   getInterEventDetailQuery,
   GetInterClubEventRequest,
   approveInterEvent: approveInterEventMutation,
   isApproving,
   rejectInterEvent: rejectInterEventMutation,
   isRejecting
  };
};
