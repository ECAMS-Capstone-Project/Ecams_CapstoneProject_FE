import toast from "react-hot-toast";
import axiosMultipartForm from "../axiosMultipartForm";
import { ResponseDTO } from "../BaseResponse";
import { CheckBuyPackage, HandleResponse, PaymentDetails } from "@/models/Payment";
import { post } from "../agent";

export const paymentPackage = async (formData: FormData): Promise<ResponseDTO<PaymentDetails | string>> => {
    try {
        const response = await axiosMultipartForm.post("/Payment/package", formData);
        const apiResponse = response.data as ResponseDTO<PaymentDetails | string>;

        // Kiểm tra payment method từ response hoặc formData để xử lý khác nhau
        if (apiResponse.data && typeof apiResponse.data === "string") {
            // Nếu trả về dữ liệu là string (chắc là thông tin thanh toán VNPAY)
            console.log("VNPAY response:", apiResponse.data);
            return apiResponse; // Trả về dạng string
        } else if (apiResponse.data && typeof apiResponse.data === "object") {
            // Nếu trả về PaymentDetails (chắc là thanh toán PAYOS)
            console.log("PAYOS response:", apiResponse.data);
            return apiResponse; // Trả về PaymentDetails
        } else {
            console.error("Unexpected response data format");
            throw new Error("Unexpected response data format");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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


export const handleResponse = async (data: HandleResponse): Promise<ResponseDTO<string>> => {
    try {
        const response = await post<ResponseDTO<string>>("/Payment/package/handle-response", data);
        return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const CheckBuyPackageAPI = async (data: CheckBuyPackage): Promise<ResponseDTO<string>> => {
    try {
        const response = await post<ResponseDTO<string>>("/Package/check-request", data);
        return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const exchangePackage = async (formData: FormData): Promise<ResponseDTO<PaymentDetails | string>> => {
    try {
        const response = await axiosMultipartForm.post("/Payment/package/extend", formData);
        const apiResponse = response.data as ResponseDTO<PaymentDetails | string>;

        if (apiResponse.data && typeof apiResponse.data === "string") {
            // Nếu trả về dữ liệu là string (chắc là thông tin thanh toán VNPAY)
            return apiResponse; // Trả về dạng string
        } else if (apiResponse.data && typeof apiResponse.data === "object") {
            // Nếu trả về PaymentDetails (chắc là thanh toán PAYOS)
            return apiResponse; // Trả về PaymentDetails
        } else {
            console.error("Unexpected response data format");
            throw new Error("Unexpected response data format");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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