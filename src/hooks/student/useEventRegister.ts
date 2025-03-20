/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { paymentEvent } from "@/api/student/EventRegistrationAgent";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePaymentEvent = () => {
  return useMutation({
    mutationFn: async (data: { studentId: string, eventId: string, paymentMethodId?: string }) => {
      try {
        const response = await paymentEvent(data);
        return response;
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Nếu event miễn phí, hiển thị thông báo thành công
      toast.success("Event registration successful!");
    },
    onError: (error: any) => {
      console.error("Payment error:", error);
      // toast.error(error.response?.message || "Có lỗi xảy ra khi đăng ký sự kiện");
    }
  });
};
