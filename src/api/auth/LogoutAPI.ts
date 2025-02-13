import toast from "react-hot-toast";
import { post } from "../agent";
import { ResponseDTO } from "../BaseResponse";

export const logoutAPI = async (): Promise<ResponseDTO<string>> => {
    try {
        const response = await post<ResponseDTO<string>>("/Auth/logout");
        return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.response.status == 400) {
            toast.error("Something went wrong. Please try again.");
        } else if (error.response.status == 401) {
            toast.error(error.response.data.message);
        }
        if (error.response) {
            console.log(error.response.data.errors);
            console.error("API Error:", error.response.data);
            throw new Error(error.response.data.message || "API Error");
        } else {
            console.error("Network Error:", error.message);
            throw new Error("Network error. Please try again later.");
        }
    }
};