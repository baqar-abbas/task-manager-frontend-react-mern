// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Task Types
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  completedAt?: string;
  tags: string[];
  user: string | User;
  isPublic: boolean;
  estimatedTime?: number;
  actualTimeSpent: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Pagination Types
export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  tasks: T[];
  pagination: Pagination;
}
