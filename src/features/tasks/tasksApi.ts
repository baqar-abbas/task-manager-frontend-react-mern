import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ApiResponse,
  Task,
  PaginatedResponse,
} from "../../utils/types/api.types";
import { mockApi } from "../../services/mockData";
import type {
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskStatusRequest,
} from "./types";

const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.PROD;

// Mock base query for tasks
const mockTasksBaseQuery = async (args: any) => {
  const { url, method, body, params } = args;

  if (url === "/tasks" && method === "GET") {
    const response = await mockApi.tasks.getAll(params);
    return { data: response };
  }

  if (url === "/tasks" && method === "POST") {
    const response = await mockApi.tasks.create(body);
    return { data: response };
  }

  // Add more mock endpoints as needed
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

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: USE_MOCK ? mockTasksBaseQuery : realBaseQuery,
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<ApiResponse<PaginatedResponse<Task>>, any>({
      query: (params) => ({
        url: "/tasks",
        params,
      }),
      providesTags: (result) =>
        result?.data // Null check before accessing result.data
          ? [
              ...result.data.tasks.map(({ _id }) => ({
                type: "Task" as const,
                id: _id,
              })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),
    getTaskById: builder.query<ApiResponse<{ task: Task }>, string>({
      query: (id) => `/tasks/${id}`,
    }),
    createTask: builder.mutation<
      ApiResponse<{ task: Task }>,
      CreateTaskRequest
    >({
      query: (taskData) => ({
        url: "/tasks",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: builder.mutation<
      ApiResponse<{ task: Task }>,
      { id: string; data: UpdateTaskRequest }
    >({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),
    deleteTask: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
    updateTaskStatus: builder.mutation<
      ApiResponse<{ task: Task }>,
      { id: string; data: UpdateTaskStatusRequest }
    >({
      query: ({ id, data }) => ({
        url: `/tasks/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),
    getTaskStats: builder.query<ApiResponse<any>, void>({
      query: () => "/tasks/stats/overview",
    }),
    getFilterOptions: builder.query<ApiResponse<any>, void>({
      query: () => "/tasks/filter/options",
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
  useGetTaskStatsQuery,
  useGetFilterOptionsQuery,
} = tasksApi;
