/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaymentDetails } from "@/models/Payment";
import { post } from "../agent";
import { ResponseDTO } from "../BaseResponse";
import toast from "react-hot-toast";
export const paymentEvent = async (data: { studentId: string, eventId: string, paymentMethodId?: string }): Promise<ResponseDTO<PaymentDetails | string>> => {
    try {
        const response = await post("/Payment/event", data) as { data: ResponseDTO<PaymentDetails | string> };
        
        // Kiểm tra toàn bộ response
        console.log("Full API Response:", response);

        // Kiểm tra nếu response.data thực sự tồn tại
        const apiResponse = response.data;

        // Kiểm tra kiểu dữ liệu của apiResponse.data
        if (apiResponse) {
            console.log("API Response Data:", apiResponse);
            
            console.log("API Response type:", typeof apiResponse);
            // Kiểm tra nếu dữ liệu trả về là một chuỗi (URL thanh toán VNPAY)
            if (typeof apiResponse === "string") {
                console.log("VNPAY response:", apiResponse);
                // Điều hướng đến URL thanh toán VNPAY
                window.location.replace(apiResponse);
                return apiResponse; // Đảm bảo trả về data
            }

            // Nếu trả về PaymentDetails (thông tin thanh toán PAYOS)
            else if (typeof apiResponse.data === "object") {
                console.log("PAYOS response:", apiResponse.data);
                return apiResponse; // Trả về PaymentDetails
            }
        }

        // Nếu không có apiResponse.data, báo lỗi
        console.error("Unexpected response data format or missing data.");
        throw new Error(`Unexpected response data format: ${JSON.stringify(apiResponse)}`);

    } catch (error: any) {
        console.error("Error in paymentEvent:", error);
        // toast.error(error.response.data.message || "API Error");
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
