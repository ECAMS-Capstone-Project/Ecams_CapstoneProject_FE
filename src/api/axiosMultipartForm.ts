import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  // InternalAxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";

const axiosMultipartForm: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ECAMS_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosMultipartForm.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    // Initialize header if not already defined
    config.headers = config.headers || {};

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  // (config) => {
  //   // Log config của request
  //   return config;
  // },
  function (error) {
    return Promise.reject(error);
  }
);

axiosMultipartForm.interceptors.response.use(
  function (response: AxiosResponse) {
    return response;
  },

  function (error) {
    if (error.message === "Network Error" && !error.response) {
      toast.error("Network Error, Please check connection!");
    }
    if (error.response && error.response.status === 401) {
      toast.error("You not allow to access this page");
    }
    return Promise.reject(error);
  }
);

export default axiosMultipartForm;
