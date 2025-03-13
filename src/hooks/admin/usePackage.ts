/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PackageList, createPackage, deactivePackage } from "@/api/agent/PackageAgent";

// Custom hook cho Package
export const usePackages = (pageSize?: number, pageNo?: number) => {
  const queryClient = useQueryClient();

  // Fetch danh sách packages theo trang
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["packages", pageNo || 1, pageSize || 5], // Query key động
    queryFn: () => PackageList(pageNo || 1, pageSize || 5),
    refetchOnMount: true, // 🔥 Bắt buộc lấy dữ liệu mới sau khi xóa
    refetchOnWindowFocus: false, // 🔥 Không tự động refetch khi chuyển tab
  });

  // Tạo mới package
  const { mutateAsync: createPackageMutation, isPending: isCreating } = useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      toast.success("Package created successfully!");
      queryClient.invalidateQueries({ queryKey: ["packages"] }); // Tự động refetch danh sách ✅
    },
    onError: (error: any) => {
      console.error("Error:", error.response.data.errors);
      toast.error(error.response.data.message || "An error occurred");
    },
  });

  // Xóa package
  const { mutateAsync: deletePackageMutation, isPending: isDeleting } = useMutation({
    mutationFn: deactivePackage,
    onSuccess: () => {
      refetch();
      toast.success("Package deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["packages"] }); // Tự động refetch danh sách ✅
    },
    onError: (error: any) => {
      toast.error(error.message || "Error deleting package");
    },
  });



  return {
    packages: data?.data?.data || [],
    totalPages: data?.data?.totalPages || 1,
    isLoading,
    pageNo,
    pageSize,
    isCreating,
    isDeleting,
    refetchPackage: refetch,
    createPackage: createPackageMutation,
    deactivePackage: deletePackageMutation,
  };
};
