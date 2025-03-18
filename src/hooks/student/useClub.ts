/* eslint-disable react-hooks/rules-of-hooks */


import {  EventFilterParams, getAllEventList, getEventClub } from "@/api/representative/EventAgent";
import {   useQuery} from "@tanstack/react-query";

import { getClub } from "@/api/student/ClubAgent";
import { GetClubsDetailAPI } from "@/api/club-owner/ClubByUser";

export const useClubs = (uniId?: string,pageNumber?: number, pageSize?: number) => {
//   const queryClient = useQueryClient();

  // Fetch danh sách area theo trang
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["clubs", uniId, pageNumber, pageSize], // Query key động dựa trên uniId, pageNumber và pageSize
    queryFn: () => getClub(uniId || "", pageNumber || 1, pageSize || 5),
    refetchOnMount: true, // Bắt buộc lấy dữ liệu mới sau khi xóa
    refetchOnWindowFocus: false, // Không tự động refetch khi chuyển tab
    enabled: !!uniId, // Chỉ chạy query khi uniId có giá trị
  });
  

    const getAllEventListQuery = ( pageNumber: number, pageSize: number, filterParams?: EventFilterParams) => {
      return useQuery({
        queryKey: ["allEvents",  pageNumber, pageSize, filterParams], // Query key động dựa trên uniId, pageNumber và pageSize
        queryFn: () => getAllEventList(pageNumber, pageSize, filterParams), // Gọi API lấy thông tin Event Club
        enabled: true, // Chỉ thực hiện khi có uniId
      });
    };

  const getEventClubQuery = (uniId: string, pageNumber: number, pageSize: number) => {
    return useQuery({
      queryKey: ["clubs", uniId, pageNumber, pageSize], // Query key động dựa trên uniId, pageNumber và pageSize
      queryFn: () => getEventClub(uniId, pageNumber, pageSize), // Gọi API lấy thông tin Event Club
      enabled: !!uniId, // Chỉ thực hiện khi có uniId
    });
  };

    // Fetch chi tiết detail club theo clubId
    const getClubDetailQuery = (clubId: string) => {
      return useQuery({
        queryKey: ["eventDetail", clubId], // Query key động dựa trên eventId
        queryFn: () => GetClubsDetailAPI(clubId), // Gọi API lấy chi tiết sự kiện
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
   

  return {
    clubs: data?.data?.data || [],
    totalPages: data?.data?.totalPages || 1,
    isLoading,

   refetchEvents: refetch,
   getEventClubQuery,
   getAllEventListQuery,
   getClubDetailQuery
  };
};
