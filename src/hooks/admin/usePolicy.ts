/* eslint-disable @typescript-eslint/no-explicit-any */

import { createPolicy, getPolicyList } from "@/api/agent/PolicyAgent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePolicy = (pageSize?: number, pageNo?: number) => {
  const queryClient = useQueryClient();

  // Fetch danh sách packages theo trang
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["policies", pageNo || 1, pageSize || 5], // Query key động
    queryFn: () => getPolicyList(pageNo || 1, pageSize || 5),
    refetchOnMount: true, // 🔥 Bắt buộc lấy dữ liệu mới sau khi xóa
    refetchOnWindowFocus: false, // 🔥 Không tự động refetch khi chuyển tab
  });

  // Tạo mới package
  const { mutateAsync: createPolicyMutation, isPending: isCreating } =
    useMutation({
      mutationFn: createPolicy,
      onSuccess: () => {
        //   toast.success("Not created successfully!");
        queryClient.invalidateQueries({ queryKey: ["policies"] }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        console.error("Error:", error.response.data.errors);
        toast.error(error.response.data.message || "An error occurred");
      },
    });

  return {
    policies: data?.data?.data || [],
    totalPages: data?.data?.totalPages || 1,
    isLoading,
    isCreating,
    refetchNotification: refetch,
    createPolicy: createPolicyMutation,
  };
};
