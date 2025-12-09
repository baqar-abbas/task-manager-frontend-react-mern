import type { Task, Pagination } from "../../utils/types/api.types";

export interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  pagination: Pagination | null;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: "pending" | "in-progress" | "completed" | "archived";
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  tags?: string[];
  isPublic?: boolean;
  estimatedTime?: number;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  actualTimeSpent?: number;
}

export interface UpdateTaskStatusRequest {
  status: "pending" | "in-progress" | "completed" | "archived";
}
