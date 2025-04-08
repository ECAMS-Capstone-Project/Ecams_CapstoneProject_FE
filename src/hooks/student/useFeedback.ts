/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { createFeedback, getFeedback } from "@/api/student/FeedbackAgent";
import { FeedbackRequest } from "@/models/Feedback";

export const useFeedback = (
  eventId?: string,
  rating?: number | null,
  pageNumber?: number,
  pageSize?: number
) => {
  const queryClient = useQueryClient();

  // Fetch danh sách area theo trang
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["feedbacks", eventId, rating, pageNumber, pageSize], // Query key động dựa trên uniId, pageNumber và pageSize
    queryFn: () =>
      getFeedback(
        eventId || "",
        rating || null,
        pageNumber || 1,
        pageSize || 5
      ),
    refetchOnMount: true, // Bắt buộc lấy dữ liệu mới sau khi xóa
    refetchOnWindowFocus: false, // Không tự động refetch khi chuyển tab
    enabled: !!eventId, // Chỉ chạy query khi uniId có giá trị
  });

  const { mutateAsync: createFeedbackQuery, isPending } = useMutation({
    mutationFn: (data: FeedbackRequest) => {
      return createFeedback(data);
    },
    onSuccess: () => {
      toast.success("Successfully created feedback!");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
    onError: (error: any) => {
      console.error("Error:", error.response.data.errors);
      // toast.error(error.response.data.message || "An error occurred");
    },
  });

  return {
    feedbacks: data?.data?.data || [],
    totalPages: data?.data?.totalPages || 1,
    isLoading,
    isPending,
    refetchEvents: refetch,
    createFeedbackQuery,
  };
};
