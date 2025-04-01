
import { GetInterMessage } from "@/api/club-owner/InterEventMessage";
import { useQuery } from "@tanstack/react-query";

export const useMessage = (eventId?: string) => {


  // Fetch danh sách area theo trang
  const { data, isLoading, refetch } = useQuery({

    queryKey: ["interMessages", eventId], // Query key động dựa trên uniId, pageNumber và pageSize
    queryFn: () => GetInterMessage(eventId || ""),
    refetchOnMount: true, // Bắt buộc lấy dữ liệu mới sau khi xóa
    refetchOnWindowFocus: false, // Không tự động refetch khi chuyển tab
    enabled: !!eventId, // Chỉ chạy query khi uniId có giá trị
  });
  

  return {
    messages: data?.data || [],
    isLoading,
   refetchMessages: refetch,
  
  };
};
