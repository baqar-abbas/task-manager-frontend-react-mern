import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../../utils/types/api.types";
import { mockApi } from "../../services/mockData";

// Determine if we should use mock or real API
const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.PROD;

// Mock base query for development
const mockBaseQuery = async (args: any) => {
  const { url, method, body } = args;

  if (url === "/auth/login" && method === "POST") {
    const response = await mockApi.auth.login(body);
    return { data: response };
  }

  //   if (url === "/auth/register" && method === "POST") {
  //     const response = await mockApi.auth.register(body);
  //     return { data: response };
  //   }

  if (url === "/auth/register" && method === "POST") {
    const response = await mockApi.auth.register(body);
    return { data: response };
  }

  if (url === "/auth/logout" && method === "POST") {
    // Mock logout - just return success
    return { data: { success: true, message: "Logged out successfully" } };
  }

  //   return {
  //     error: { status: 404, data: { message: "Mock endpoint not found" } },
  //   };
  return {
    error: { status: 404, data: { message: "Mock endpoint not found" } },
  };
};

// Real API base query
const realBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: USE_MOCK ? mockBaseQuery : realBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthResponse>, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<ApiResponse<AuthResponse>, RegisterCredentials>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    getProfile: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => "/auth/me",
    }),
    updateProfile: builder.mutation<ApiResponse<{ user: User }>, Partial<User>>(
      {
        query: (userData) => ({
          url: "/auth/update-profile",
          method: "PUT",
          body: userData,
        }),
      }
    ),
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
} = authApi;
