/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseDTO } from "@/api/BaseResponse";
import {
  checkInStudent,
  checkUserCanCheckIn,
  getCheckInInfo,
  getRefundById,
  paymentEvent,
  refundEvent,
} from "@/api/student/EventRegistrationAgent";
import { getSchedule } from "@/api/student/StudentScheduleAgent";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePaymentEvent = () => {
  return useMutation({
    mutationFn: async (data: {
      studentId: string;
      eventId: string;
      paymentMethodId?: string;
    }) => {
      try {
        const response = await paymentEvent(data);
        return response;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Nếu event miễn phí, hiển thị thông báo thành công
      toast.success("Event registration successful!");
    },
    onError: (error: any) => {
      console.error("Payment error:", error);
      // toast.error(error.response?.message || "Có lỗi xảy ra khi đăng ký sự kiện");
    },
  });
};

export const useEventSchedule = (userId?: string) => {
  // const queryClient = useQueryClient();

  // Fetch danh sách area theo trang
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["studentEvents"], // Query key động
    queryFn: () => getSchedule(userId ?? ""),
    refetchOnMount: true, // 🔥 Bắt buộc lấy dữ liệu mới sau khi xóa
    refetchOnWindowFocus: false, // 🔥 Không tự động refetch khi chuyển tab
    enabled: !!userId,
  });

  const getCheckInInfoQuery = (userId: string, eventId: string) => {
    return useQuery({
      queryKey: ["checkIn", userId, eventId], // Query key động dựa trên uniId, pageNumber và pageSize
      queryFn: () => getCheckInInfo(userId, eventId), // Gọi API lấy thông tin Event Club
      enabled: !!userId && !!eventId, // Chỉ thực hiện khi có uniId
    });
  };

  const { mutateAsync: checkInStudentEvent, isPending: isCheckingIn } =
    useMutation<
      ResponseDTO<Event>,
      unknown,
      { eventId: string; userId: string; token: string }
    >({
      mutationFn: ({ eventId, userId, token }) =>
        checkInStudent(eventId, userId, token),

      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Error approving event");
      },
    });
  const { mutateAsync: refundEventMutation, isPending: isRefunding } =
    useMutation({
      mutationFn: refundEvent,
      onSuccess: () => {
        toast.success("Refund requested successfully!");
        //  queryClient.invalidateQueries({ queryKey: ["eventClub"] }); // Tự động refetch danh sách ✅
      },
      onError: (error: any) => {
        console.error("Error:", error);
        toast.error(error.response.data.message || "An error occurred");
      },
    });
  const {
    mutateAsync: getUserCanCheckIn,
    isPending: isCheckingUserCanCheckIn,
  } = useMutation<
    ResponseDTO<boolean>,
    unknown,
    { eventId: string; userId: string }
  >({
    mutationFn: ({ eventId, userId }) => checkUserCanCheckIn(eventId, userId),
  });
  const getRefundDetail = (refundId: string) => {
    return useQuery({
      queryKey: ["refundDetails", refundId], // Query key động dựa trên uniId, pageNumber và pageSize
      queryFn: () => getRefundById(refundId), // Gọi API lấy thông tin Event Club
      enabled: !!refundId, // Chỉ thực hiện khi có uniId
    });
  };

  return {
    studentEvents: data?.data || [],
    isLoading,

    refetchArea: refetch,
    checkInStudent: checkInStudentEvent,
    isCheckingIn,
    getCheckInInfoQuery,
    getUserCanCheckIn,
    isCheckingUserCanCheckIn,
    refundEvent: refundEventMutation,
    isRefunding,
    getRefundDetail,
  };
};
