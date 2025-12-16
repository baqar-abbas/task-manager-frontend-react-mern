import { io, Socket } from "socket.io-client";
import { store } from "../app/store";
import {
  socketConnected,
  socketDisconnected,
  addNotification,
} from "../features/socket/socketSlice";
import { addTask, updateTask, removeTask } from "../features/tasks/tasksSlice";

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  connect(token: string) {
    if (this.socket && this.isConnected) {
      console.log("Socket already connected");
      return;
    }

    // Disconnect existing socket
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        auth: { token },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        timeout: 10000,
      }
    );

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Update Redux state
      store.dispatch(socketConnected(this.socket?.id || ""));

      // Show notification
      store.dispatch(
        addNotification({
          type: "success",
          message: "Real-time connection established",
        })
      );
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      this.isConnected = false;
      store.dispatch(socketDisconnected());

      if (reason === "io server disconnect") {
        // Server initiated disconnect, try to reconnect
        this.socket?.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        store.dispatch(
          addNotification({
            type: "error",
            message: "Failed to establish real-time connection",
          })
        );
      }
    });

    // Task Events
    this.socket.on("task-created", (data) => {
      console.log("📝 Socket: Task created", data);
      if (data.success && data.task) {
        store.dispatch(addTask(data.task));
        store.dispatch(
          addNotification({
            type: "info",
            message: `New task: ${data.task.title}`,
          })
        );
      }
    });

    this.socket.on("task-updated", (data) => {
      console.log("✏️ Socket: Task updated", data);
      if (data.success && data.task) {
        store.dispatch(updateTask(data.task));
        store.dispatch(
          addNotification({
            type: "info",
            message: `Task updated: ${data.task.title}`,
          })
        );
      }
    });

    this.socket.on("task-deleted", (data) => {
      console.log("🗑️ Socket: Task deleted", data);
      if (data.success && data.taskId) {
        store.dispatch(removeTask(data.taskId));
        store.dispatch(
          addNotification({
            type: "info",
            message: "Task deleted",
          })
        );
      }
    });

    this.socket.on("task-status-updated", (data) => {
      console.log("🔄 Socket: Task status updated", data);
      if (data.success && data.task) {
        store.dispatch(updateTask(data.task));
      }
    });
  }

  joinTaskRoom(taskId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit("join-task-room", taskId);
      console.log(`Joined task room: ${taskId}`);
    }
  }

  leaveTaskRoom(taskId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit("leave-task-room", taskId);
      console.log(`Left task room: ${taskId}`);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log("Socket disconnected manually");
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected;
  }
}

export default new SocketService();
