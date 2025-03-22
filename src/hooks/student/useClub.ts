/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */


import {  getEventClub } from "@/api/representative/EventAgent";
import {   useMutation, useQuery} from "@tanstack/react-query";

import { getClub } from "@/api/student/ClubAgent";
import { CreateClubJoinedRequest, GetAllClubCondition, GetClubsDetailAPI } from "@/api/club-owner/ClubByUser";
import { ClubJoinedRequest } from "@/models/Club";
import toast from "react-hot-toast";

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
  

    const getAllConditionsQuery = ( clubId: string) => {
      return useQuery({
        queryKey: ["conditions",  clubId], // Query key động dựa trên uniId, pageNumber và pageSize
        queryFn: () => GetAllClubCondition(clubId), // Gọi API lấy thông tin Event Club
        enabled: !!clubId, // Chỉ thực hiện khi có uniId
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
    const {mutateAsync:CreateClubJoinedRequestQuery, isPending} = useMutation({
      mutationFn: (data: ClubJoinedRequest) => {
        const clubId = data.clubId;
        return CreateClubJoinedRequest(data, clubId);
      },
      onSuccess: () => {

        toast.success("Successfully registered for the club!");
      },
      onError: (error: any) => {
        console.error("Error:", error.response.data.errors);
        // toast.error(error.response.data.message || "An error occurred");
      },
    });

  return {
    clubs: data?.data?.data || [],
    totalPages: data?.data?.totalPages || 1,
    isLoading,
   isPending,
   refetchEvents: refetch,
   createClubJoinedRequest: CreateClubJoinedRequestQuery,
   getEventClubQuery,
   getAllConditionsQuery,
   getClubDetailQuery
  };
};
