import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task, Pagination } from "../../utils/types/api.types";
import type {
  TasksState,
  TaskFilters,
} from "./types";

const initialState: TasksState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  filters: {
    status: undefined,
    priority: undefined,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  },
  pagination: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (
      state,
      action: PayloadAction<{ tasks: Task[]; pagination?: Pagination }>
    ) => {
      state.tasks = action.payload.tasks;
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination;
      }
      state.isLoading = false;
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task._id === action.payload._id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.currentTask?._id === action.payload._id) {
        state.currentTask = action.payload;
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      if (state.currentTask?._id === action.payload) {
        state.currentTask = null;
      }
    },
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TaskFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearTasks: (state) => {
      state.tasks = [];
      state.currentTask = null;
      state.pagination = null;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setCurrentTask,
  setLoading,
  setError,
  setFilters,
  resetFilters,
  clearTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
