/* eslint-disable @typescript-eslint/no-explicit-any */
import { deactiveWallet, getWalletList, insertWallet, updateWallet } from "@/api/staff/WalletAgent";
import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useWallet = (universityId?: string, token?:string, pageSize?: number, pageNo?: number) => {
  const queryClient = useQueryClient();

  // Fetch danh sách area theo trang
    const { data, isLoading, refetch } =  useQuery({
      queryKey: ["wallets",universityId, token, pageNo || 0, pageSize || 5], // Query key động
      queryFn:  () =>  getWalletList(universityId ?? "",token ?? "",  pageNo || 0,pageSize || 5,),
      refetchOnMount: true, // 🔥 Bắt buộc lấy dữ liệu mới sau khi xóa
      refetchOnWindowFocus: false, // 🔥 Không tự động refetch khi chuyển tab
    enabled:true, 
      
    });

    console.log("Data after invalidateQueries:", data);
    console.log("Is loading:", isLoading);

    const {mutateAsync:createWalletMutation, isPending} = useMutation({
      mutationFn: insertWallet,
      onSuccess: () => {
        toast.success("Wallet created successfully!");
        queryClient.invalidateQueries({ queryKey: ["wallets"] }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        console.error("Error:", error.response.data.errors);
        toast.error(error.response.data.message || "An error occurred");
      },
    });
  
    // Xóa area
    const {mutateAsync: deleteWalletMutation, isPending: isDeleting} = useMutation({
      mutationFn: deactiveWallet,
      onSuccess: () => {
        // refetch();
        toast.success("Wallet deleted successfully!");
        refetch(); 
        queryClient.invalidateQueries({
          queryKey: ["wallets", universityId, token, pageNo || 0, pageSize || 5]
        });
      },
      onError: (error: any) => {
        toast.error(error.response.data.message || "Error deleting area");
      },
      onSettled: () => {
        // Đảm bảo invalidateQueries được gọi sau khi mutation hoàn tất
        queryClient.invalidateQueries({
          queryKey: ["wallets"]
        });
      }
    });
    const {mutateAsync: updateWalletMutation, isPending: isUpdating} = useMutation({
      mutationFn: updateWallet,
      onSuccess: () => {
        // refetch();
        toast.success("Wallet updated successfully!");
        queryClient.invalidateQueries( {queryKey:["wallets"]}); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        toast.error(error.response.data.message || "Error deleting wallet");
      },
    });
  
 

  return {
    wallets: data?.data?.data || [],
    totalPages: data?.data?.totalPages || 1,
    isLoading,
    pageNo,
    pageSize,
   isUpdating,
   isPending,
   isDeleting,
   refetchArea: refetch,
   createWallet: createWalletMutation,
   updateWallet: updateWalletMutation,
    deactiveWallet:deleteWalletMutation
  };
};
