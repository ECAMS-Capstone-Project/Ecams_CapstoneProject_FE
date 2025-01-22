import apiClient from "./ApiClient";

// Hàm generic cho GET request
export const get = async <T>(url: string, params?: object): Promise<T> => {
  const response = await apiClient.get<T>(url, { params });
  return response.data;
};
// Hàm generic cho POST request
export const post = async <T>(
  url: string,
  data?: object,
  config?: object
): Promise<T> => {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
};

// Hàm generic cho PUT request
export const put = async <T>(
  url: string,
  data?: object,
  config?: object
): Promise<T> => {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
};

// Hàm generic cho PATCH request
export const patch = async <T>(
  url: string,
  data?: object,
  config?: object
): Promise<T> => {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
};

// Hàm generic cho DELETE request
export const del = async <T>(url: string, config?: object): Promise<T> => {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};
