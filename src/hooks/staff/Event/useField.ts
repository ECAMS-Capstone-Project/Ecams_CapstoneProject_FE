/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseDTO } from "@/api/BaseResponse";
import {
  approveEvent,
  createEvent,
  createEventClub,
  EventFilterParams,
  getAllEventList,
  getEventClub,
  getEventClubDetail,
  getEventDetail,
  rejectEvent,
} from "@/api/representative/EventAgent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Event } from "@/models/Event";
import { GetAllFields } from "@/api/club-owner/RequestClubAPI";

export const useFields = () => {
  const queryClient = useQueryClient();

  // Fetch danh sách area theo trang
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["fields"], // Query key động
    queryFn: () => GetAllFields(),
    refetchOnMount: true, // 🔥 Bắt buộc lấy dữ liệu mới sau khi xóa
    refetchOnWindowFocus: false, // 🔥 Không tự động refetch khi chuyển tab
    enabled: true,
  });

  const getAllEventListQuery = (
    pageNumber: number,
    pageSize: number,
    filterParams?: EventFilterParams
  ) => {
    return useQuery({
      queryKey: ["allEvents", pageNumber, pageSize, filterParams], // Query key động dựa trên uniId, pageNumber và pageSize
      queryFn: () => getAllEventList(pageNumber, pageSize, filterParams), // Gọi API lấy thông tin Event Club
      enabled: true, // Chỉ thực hiện khi có uniId
    });
  };

  // Tạo mới event
  const { mutateAsync: createEventMutation, isPending } = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      toast.success("Event created successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] }); // Tự động refetch danh sách ✅
    },
    onError: (error: any) => {
      console.error("Error:", error.response.data.errors);
      toast.error(error.response.data.message || "An error occurred");
    },
  });
  const { mutateAsync: createEventClubMutation, isPending: isCreatePending } =
    useMutation({
      mutationFn: createEventClub,
      onSuccess: () => {
        toast.success("Event Club created successfully!");
        queryClient.invalidateQueries({ queryKey: ["eventClub"] }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        console.error("Error:", error);
        toast.error(error.response.data.message || "An error occurred");
      },
    });

  // Fetch chi tiết event theo eventId
  const getEventDetailQuery = (eventId: string, userId: string) => {
    return useQuery({
      queryKey: ["eventDetail", eventId, userId], // Query key động dựa trên eventId
      queryFn: () => getEventDetail(eventId, userId), // Gọi API lấy chi tiết sự kiện
      enabled: !!eventId && !!userId, // Chỉ thực hiện khi có eventId
    });
  };
  const getEventClubDetailQuery = (clubId: string) => {
    return useQuery({
      queryKey: ["eventClubDetail", clubId], // Query key động dựa trên eventId
      queryFn: () => getEventClubDetail(clubId), // Gọi API lấy chi tiết sự kiện
      enabled: true, // Chỉ thực hiện khi có eventId
    });
  };

  const getEventClubQuery = (
    uniId: string,
    pageNumber: number,
    pageSize: number
  ) => {
    return useQuery({
      queryKey: ["eventClub", uniId, pageNumber, pageSize], // Query key động dựa trên uniId, pageNumber và pageSize
      queryFn: () => getEventClub(uniId, pageNumber, pageSize), // Gọi API lấy thông tin Event Club
      enabled: !!uniId, // Chỉ thực hiện khi có uniId
    });
  };
  // // Xóa area
  // const {mutateAsync: deleteWalletMutation, isPending: isDeleting} = useMutation({
  //   mutationFn: deactiveWallet,
  //   onSuccess: () => {
  //     // refetch();
  //     toast.success("Wallet deleted successfully!");
  //     refetch();
  //     queryClient.invalidateQueries({
  //       queryKey: ["wallets", universityId, token, pageNo || 0, pageSize || 5]
  //     });
  //   },
  //   onError: (error: any) => {
  //     toast.error(error.response.data.message || "Error deleting area");
  //   },
  //   onSettled: () => {
  //     // Đảm bảo invalidateQueries được gọi sau khi mutation hoàn tất
  //     queryClient.invalidateQueries({
  //       queryKey: ["wallets"]
  //     });
  //   }
  // });
  const { mutateAsync: approveEventMutation, isPending: isApproving } =
    useMutation<
      ResponseDTO<Event>,
      unknown,
      { eventId: string; walletId: string }
    >({
      mutationFn: ({ eventId, walletId }) => approveEvent(eventId, walletId),
      onSuccess: () => {
        toast.success("Event approved successfully!");
        queryClient.invalidateQueries({ queryKey: ["events"] });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Error approving event");
      },
    });

  const { mutateAsync: rejectEventMutation, isPending: isRejecting } =
    useMutation({
      mutationFn: rejectEvent,
      onSuccess: () => {
        // refetch();
        toast.success("Event rejected successfully!");
        queryClient.invalidateQueries({ queryKey: ["events"] }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        toast.error(error.response.data.message || "Error approving event");
      },
    });

  return {
    fields: data?.data || [],
    isLoading,
    isPending,
    isApproving,
    isRejecting,
    isCreatePending,
    createEvent: createEventMutation,
    refetchEvents: refetch,
    getEventDetailQuery,
    approveEvent: approveEventMutation,
    rejectEvent: rejectEventMutation,
    getEventClubDetailQuery,
    createEventClub: createEventClubMutation,
    getEventClubQuery,
    getAllEventListQuery,
  };
};
