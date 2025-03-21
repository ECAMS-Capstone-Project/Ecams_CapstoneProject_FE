/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentDetails } from "@/models/Payment";
import { get, post, put } from "../agent";
import { ResponseDTO } from "../BaseResponse";
import toast from "react-hot-toast";
import { CheckInInfo } from "@/models/Event";
export const paymentEvent = async (data: { studentId: string, eventId: string, paymentMethodId?: string }): Promise<ResponseDTO<PaymentDetails | string | undefined>> => {
    try {
        const response = await post("/Payment/event", data) as { data: ResponseDTO<PaymentDetails | string | undefined> };

        // Kiểm tra toàn bộ response
        console.log("Full API Response:", response);

        const apiResponse = response.data;

        // Kiểm tra nếu apiResponse tồn tại
        if (apiResponse) {
            console.log("API Response Data:", apiResponse);

            // Kiểm tra kiểu dữ liệu của apiResponse
            if (typeof apiResponse === "string") {
                console.log("VNPAY response:", apiResponse);
                // Điều hướng đến URL thanh toán VNPAY
                window.location.replace(apiResponse);
                return apiResponse; // Đảm bảo trả về dữ liệu
            }

            // Nếu trả về PaymentDetails (thông tin thanh toán PAYOS)
            else if (typeof apiResponse === "object" && apiResponse.data) {
                console.log("PAYOS response:", apiResponse.data);
                return apiResponse; // Trả về PaymentDetails
            }
        }

        // Nếu apiResponse là undefined hoặc không có data, coi là thành công
        console.log("Payment event successful with no additional response data.");
        return response.data;; // Hoặc trả về dữ liệu mặc định nếu cần
    } catch (error: any) {
        console.error("Error in paymentEvent:", error);
        toast.error("An error occurred while processing the payment.");
        throw error; // Để các phần khác xử lý lỗi này
    }
};



export const handleEventResponse = async (data: { studentId: string, transactionInfo: string, transactionNumber: string, isSuccess: boolean }): Promise<ResponseDTO<string>> => {
    try {
        const response = await post<ResponseDTO<string>>("/Payment/event/handle-response", data);
        return response;
    } catch (error: any) {
        if (error.response) {
            console.error("API Error:", error.response.data);
            toast.error(error.response.data.message || "API Error");
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            toast.error("Network error. Please try again later");
            throw new Error("Network error. Please try again later.");
        }
    }
};

export const checkInStudent = async (eventId: string,userId: string): Promise<ResponseDTO<Event>> => {
    try {
      const response = await put<ResponseDTO<Event>>(`/Event/checkin`, {eventId,userId});
      return response; // Trả về toàn bộ phản hồi
    } catch (error: any) {
      console.error("Error in UniversityList API call:", error.response || error);
      throw error;
    }
  };

  export const getCheckInInfo = async (userId: string, eventId: string): Promise<ResponseDTO<CheckInInfo>> => {
    try {
        const response = await get<ResponseDTO<CheckInInfo>>(`/User/check-in?userId=${userId}&eventId=${eventId}`);
    
        
        return response;
        
    } catch (error) {
        console.error("Error fetching university list:", error);
    throw error;
  }
    }