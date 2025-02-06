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
    // Thêm token nếu cần
    config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJlY2Ftc0BhZG1pbi5jb20iLCJlbWFpbCI6ImVjYW1zQGFkbWluLmNvbSIsInN1YiI6IjdjMjJjY2VkLTAwODMtNGJjMi04YjE5LWUxZGZjNzVlMmQxZSIsImp0aSI6IjI0MmE2ZGUzLTkzNTktNDY2NS04ZmQ0LTdhNGVjY2ZmOTFmMiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOIiwiZXhwIjoxNzM4ODQ5OTgzLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MjU2IiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzI1NiJ9.yuFuUHX9uoK_JhEypIHMbOu1EA1h_ZgzZD5w1H9pPsM`;

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
    console.error("Request Error:", error);
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
    console.error("Response Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;