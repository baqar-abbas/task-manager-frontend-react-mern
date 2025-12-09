import type { Task, User } from "../utils/types/api.types";

// Mock user data
export const mockUser: User = {
  _id: "1",
  username: "john_doe",
  email: "john@example.com",
  role: "user",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock tasks data
export const mockTasks: Task[] = [
  {
    _id: "1",
    title: "Setup React Project",
    description: "Initialize React Vite with TypeScript and Redux",
    status: "completed",
    priority: "high",
    tags: ["react", "typescript", "redux"],
    user: mockUser._id,
    isPublic: false,
    actualTimeSpent: 120,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    _id: "2",
    title: "Implement Authentication",
    description: "Create login and register pages with JWT",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    tags: ["auth", "jwt", "security"],
    user: mockUser._id,
    isPublic: false,
    estimatedTime: 180,
    actualTimeSpent: 90,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Design Dashboard",
    description: "Create dashboard layout with task statistics",
    status: "pending",
    priority: "medium",
    tags: ["ui", "dashboard", "design"],
    user: mockUser._id,
    isPublic: true,
    estimatedTime: 120,
    actualTimeSpent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "Add Real-time Features",
    description: "Integrate Socket.io for real-time updates",
    status: "pending",
    priority: "medium",
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    tags: ["socket.io", "real-time", "websocket"],
    user: mockUser._id,
    isPublic: false,
    estimatedTime: 240,
    actualTimeSpent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock API responses
export const mockApi = {
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      await delay(800);
      return {
        success: true,
        message: "Login successful",
        data: {
          user: mockUser,
          token: "mock-jwt-token-123456",
        },
      };
    },
    register: async (data: any) => {
      await delay(800);
      return {
        success: true,
        message: "Registration successful",
        data: {
          user: { ...mockUser, username: data.username, email: data.email },
          token: "mock-jwt-token-789012",
        },
      };
    },
  },
  tasks: {
    getAll: async (params?: any) => {
      await delay(600);
      let filteredTasks = [...mockTasks];

      // Apply filters (simple mock implementation)
      if (params?.status) {
        filteredTasks = filteredTasks.filter(
          (task) => task.status === params.status
        );
      }
      if (params?.priority) {
        filteredTasks = filteredTasks.filter(
          (task) => task.priority === params.priority
        );
      }
      if (params?.search) {
        const search = params.search.toLowerCase();
        filteredTasks = filteredTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(search) ||
            task.description?.toLowerCase().includes(search)
        );
      }

      // Pagination mock
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedTasks = filteredTasks.slice(start, end);

      return {
        success: true,
        message: "Tasks fetched successfully",
        data: {
          tasks: paginatedTasks,
          pagination: {
            total: filteredTasks.length,
            totalPages: Math.ceil(filteredTasks.length / limit),
            currentPage: page,
            limit,
            hasNextPage: end < filteredTasks.length,
            hasPrevPage: page > 1,
          },
        },
      };
    },
    create: async (taskData: any) => {
      await delay(500);
      const newTask: Task = {
        _id: Date.now().toString(),
        ...taskData,
        user: mockUser._id,
        status: taskData.status || "pending",
        priority: taskData.priority || "medium",
        tags: taskData.tags || [],
        isPublic: taskData.isPublic || false,
        actualTimeSpent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockTasks.unshift(newTask);

      return {
        success: true,
        message: "Task created successfully",
        data: { task: newTask },
      };
    },
  },
};

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
