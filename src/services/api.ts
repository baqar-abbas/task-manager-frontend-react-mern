import axios from "axios";
import type { ApiResponse } from "../utils/types/api.types";

// Create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// API helper functions
export const apiClient = {
  get: <T>(url: string, params?: any) =>
    api.get<ApiResponse<T>>(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: any) =>
    api.post<ApiResponse<T>>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: any) =>
    api.put<ApiResponse<T>>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: any) =>
    api.patch<ApiResponse<T>>(url, data).then((res) => res.data),

  delete: <T>(url: string) =>
    api.delete<ApiResponse<T>>(url).then((res) => res.data),
};
