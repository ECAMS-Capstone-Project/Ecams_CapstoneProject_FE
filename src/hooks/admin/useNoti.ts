
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createNotification, deleteNotification, getNotification } from "@/api/agent/NotiAgent";
import {  useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useNotification = (pageSize?: number, pageNo?: number) => {
  const queryClient = useQueryClient();


  // Fetch danh sách packages theo trang
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notifications", pageNo || 1, pageSize || 5], // Query key động
    queryFn: () => getNotification(pageNo || 1, pageSize || 5),
    refetchOnMount: true, // 🔥 Bắt buộc lấy dữ liệu mới sau khi xóa
    refetchOnWindowFocus: false, // 🔥 Không tự động refetch khi chuyển tab
  });

  // Tạo mới package
  const { mutateAsync: createNotificationMutation, isPending: isCreating } = useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
    //   toast.success("Not created successfully!");
      queryClient.invalidateQueries({ queryKey: ["notifications"] }); // Tự động refetch danh sách ✅
    },
    onError: (error: any) => {
      console.error("Error:", error.response.data.errors);
      toast.error(error.response.data.message || "An error occurred");
    },
  });

  // Xóa package
  const { mutateAsync: deleteNotificationMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      refetch();
      toast.success("Notification deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["notifications"]}); // Tự động refetch danh sách ✅
    },
    onError: (error: any) => {
      toast.error(error.message || "Error deleting package");
    },
  });




  return {
    notifications: data?.data?.data || [],
    totalPages: data?.data?.totalPages || 1,
    isLoading,
    isCreating,
    isDeleting,
    refetchNotification: refetch,
    createNotification: createNotificationMutation,
    deleteNotification: deleteNotificationMutation,
  };
};
