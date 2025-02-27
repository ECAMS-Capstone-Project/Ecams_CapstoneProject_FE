/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { approveEvent, createEvent, getEventDetail, getEventList, rejectEvent } from "@/api/representative/EventAgent";
import {  useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useEvents = (pageNumber?: number, pageSize?: number) => {
  const queryClient = useQueryClient();

  // Fetch danh sách area theo trang
    const { data, isLoading, refetch } =  useQuery({
      queryKey: ["events", pageNumber, pageSize], // Query key động
      queryFn:  () =>  getEventList(pageNumber || 1, pageSize || 5),
      refetchOnMount: true, // 🔥 Bắt buộc lấy dữ liệu mới sau khi xóa
      refetchOnWindowFocus: false, // 🔥 Không tự động refetch khi chuyển tab
    enabled:true, 
      
    });


    // Tạo mới event
  const {mutateAsync:createEventMutation, isPending} = useMutation({
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
  
  // Fetch chi tiết event theo eventId
  const getEventDetailQuery = (eventId: string) => {
    return useQuery({
      queryKey: ["eventDetail", eventId], // Query key động dựa trên eventId
      queryFn: () => getEventDetail(eventId), // Gọi API lấy chi tiết sự kiện
      enabled: true, // Chỉ thực hiện khi có eventId
   
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
    const {mutateAsync: approveEventMutation, isPending: isApproving} = useMutation({
      mutationFn: approveEvent,
      onSuccess: () => {
        // refetch();
        toast.success("Event approved successfully!");
        queryClient.invalidateQueries( {queryKey:["events"]}); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        toast.error(error.response.data.message || "Error approving event");
      },
    });
  
    const {mutateAsync: rejectEventMutation, isPending: isRejecting} = useMutation({
      mutationFn: rejectEvent,
      onSuccess: () => {
        // refetch();
        toast.success("Event rejected successfully!");
        queryClient.invalidateQueries( {queryKey:["events"]}); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        toast.error(error.response.data.message || "Error approving event");
      },
    });

  return {
    events: data?.data?.data || [],
    totalPages: data?.data?.totalPages || 1,
    isLoading,
  isPending,
  isApproving,
  isRejecting,
  createEvent: createEventMutation,
   refetchEvents: refetch,
   getEventDetailQuery,
   approveEvent: approveEventMutation,
   rejectEvent: rejectEventMutation,
  };
};
