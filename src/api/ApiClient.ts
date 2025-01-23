import axios from "axios";

// Khởi tạo apiClient
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_ECAMS_API_URL , // Đọc từ biến môi trường hoặc dùng mặc định
  timeout: 10000, // Thời gian timeout (10 giây)
  headers: {
    "Content-Type": "application/json", // Kiểu dữ liệu mặc định
  },
});

// Thêm interceptor để xử lý request và response
apiClient.interceptors.request.use(
  (config) => {
    // Log config của request nếu cần
    console.log("Request Config:", config);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // Log data trả về từ API nếu cần
    console.log("Response Data:", response.data.data);
    return response;
  },
  (error) => {
    console.error("Response Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;