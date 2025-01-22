import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_ECAMS_API_URL, // Đọc từ biến môi trường
  timeout: 10000, // Thời gian timeout (10 giây)
  headers: {
    "Content-Type": "application/json", // Kiểu dữ liệu mặc định
  },
});

// Thêm interceptor để xử lý request và response
apiClient.interceptors.request.use(
  (config) => {
    // Thêm token nếu cần
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  // (config) => {
  //   // Log config của request
  //   return config;
  // },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => { // Log data trả về từ API
    return response;
  },
  // (error) => {
  //   // Xử lý lỗi response
  //   if (error.response?.status === 401) {
  //     // Ví dụ: Đăng xuất người dùng nếu token hết hạn
  //     localStorage.removeItem("token");
  //     window.location.href = "/login";
  //   }
  (error) => {
    console.error("Response Error:", error.response || error.message); // Log lỗi response
    return Promise.reject(error);
  }
);

export default apiClient;
