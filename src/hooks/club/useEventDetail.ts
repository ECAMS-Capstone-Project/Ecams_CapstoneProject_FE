
import { GetEventParticipants } from "@/api/club-owner/ClubEvent";
import { useQuery } from "@tanstack/react-query";

export const useEventDetail = (eventId?: string,pageNumber?: number, pageSize?: number) => {
//   const queryClient = useQueryClient();

  // Fetch danh sách area theo trang
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["participants", eventId, pageNumber, pageSize], // Query key động dựa trên uniId, pageNumber và pageSize
    queryFn: () => GetEventParticipants(eventId || "", pageNumber || 1, pageSize || 5),
    refetchOnMount: true, // Bắt buộc lấy dữ liệu mới sau khi xóa
    refetchOnWindowFocus: false, // Không tự động refetch khi chuyển tab
    enabled: !!eventId, // Chỉ chạy query khi uniId có giá trị
  });
  


  return {
    participants: data?.data?.data || [],
    totalPages: data?.data?.totalPages || 1,
    isLoading,
   refetchEvents: refetch,
 
  };
};
