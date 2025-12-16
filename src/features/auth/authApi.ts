import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../../utils/types/api.types";

// Real API base query
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  // Add timeout and other configurations
  timeout: 10000, // 10 seconds timeout
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: async (args, api, extraOptions) => {
    try {
      const result = await baseQuery(args, api, extraOptions);

      // Handle 401 errors (token expired)
      if (result.error?.status === 401) {
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      return result;
    } catch (error: any) {
      // Handle network errors
      return {
        error: {
          status: "NETWORK_ERROR",
          data: {
            message: error.message || "Network error occurred",
          },
        },
      };
    }
  },
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthResponse>, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation<ApiResponse<AuthResponse>, RegisterCredentials>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),
    getProfile: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
      // Cache profile for 5 minutes
      keepUnusedDataFor: 300,
    }),
    updateProfile: builder.mutation<ApiResponse<{ user: User }>, Partial<User>>(
      {
        query: (userData) => ({
          url: "/auth/update-profile",
          method: "PUT",
          body: userData,
        }),
        invalidatesTags: ["Auth"],
        // Optimistic update
        async onQueryStarted(updatedData, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            authApi.util.updateQueryData("getProfile", undefined, (draft) => {
              if (draft.data?.user) {
                Object.assign(draft.data.user, updatedData);
              }
            })
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
      }
    ),
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
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
