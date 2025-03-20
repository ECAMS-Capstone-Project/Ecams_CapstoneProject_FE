import { handleEventResponse } from "@/api/student/EventRegistrationAgent";
import { useMutation } from "@tanstack/react-query";// Đảm bảo import hàm handleEventResponse
import { toast } from "react-hot-toast";

export const useHandleEventResponse = () => {
  return useMutation({
    mutationFn: async (data: { studentId: string, eventId: string, transactionInfo: string, transactionNumber: string, isSuccess: boolean }) => {
      try {
        const response = await handleEventResponse(data);
        return response;
      } catch (error) {
        toast.error("An error occurred while processing the event response.");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Event response processed successfully");
    },
    onError: () => {
      toast.error("An error occurred while processing the event response.");
    }
  });
};