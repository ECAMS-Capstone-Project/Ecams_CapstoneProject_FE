/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAreaList,
  createArea,
  deactiveArea,
  updateArea,
} from "@/api/representative/AreaAgent";
import toast from "react-hot-toast";

export const useAreas = (
  pageSize?: number,
  pageNo?: number,
  uniId?: string
) => {
  const queryClient = useQueryClient();

  // Fetch danh sách area theo trang
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["areas", pageNo || 1, pageSize || 5], // Query key động
    queryFn: () => getAreaList(pageNo || 1, pageSize || 5, uniId || ""),
    refetchOnMount: true, // 🔥 Bắt buộc lấy dữ liệu mới sau khi xóa
    refetchOnWindowFocus: false, // 🔥 Không tự động refetch khi chuyển tab
    enabled: !!uniId,
  });

  // Tạo mới area
  const { mutateAsync: createAreaMutation, isPending } = useMutation({
    mutationFn: createArea,
    onSuccess: () => {
      toast.success("Area created successfully!");
      queryClient.invalidateQueries({ queryKey: ["areas"] }); // Tự động refetch danh sách ✅
    },
    onError: (error: any) => {
      console.error("Error:", error.response.data.errors);
      toast.error(error.response.data.message || "An error occurred");
    },
  });

  // Xóa area
  const { mutateAsync: deleteAreaMutation, isPending: isDeleting } =
    useMutation({
      mutationFn: deactiveArea,
      onSuccess: () => {
        // refetch();
        refetch();

        queryClient.invalidateQueries({
          queryKey: ["areas", pageNo || 1, pageSize || 5],
        }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        toast.error(error.message || "Error deleting area");
      },
    });
  const { mutateAsync: updateAreaMutation, isPending: isUpdating } =
    useMutation({
      mutationFn: updateArea,
      onSuccess: () => {
        // refetch();
        toast.success("Area updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["areas"] }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        console.error(error.message || "Error deleting area");
      },
    });

  return {
    areas: data?.data?.data || [],
    totalPages: data?.data?.totalPages || 1,
    isLoading,
    pageNo,
    pageSize,
    isPending,
    isDeleting,
    isUpdating,
    refetchArea: refetch,
    createArea: createAreaMutation,
    deleteArea: deleteAreaMutation,
    updateArea: updateAreaMutation,
  };
};
