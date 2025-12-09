import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Task } from "../../utils/types/api.types";

export interface SocketState {
  isConnected: boolean;
  socketId: string | null;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  timestamp: number;
}

const initialState: SocketState = {
  isConnected: false,
  socketId: null,
  notifications: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    socketConnected: (state, action: PayloadAction<string>) => {
      state.isConnected = true;
      state.socketId = action.payload;
    },
    socketDisconnected: (state) => {
      state.isConnected = false;
      state.socketId = null;
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id" | "timestamp">>
    ) => {
      const notification: Notification = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...action.payload,
      };
      state.notifications.push(notification);

      // Keep only last 5 notifications
      if (state.notifications.length > 5) {
        state.notifications.shift();
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    taskCreatedViaSocket: (state, action: PayloadAction<Task>) => {
      // This action will be handled by tasks extraReducers
      state.notifications.push({
        id: Date.now().toString(),
        type: "info",
        message: `New task created: ${action.payload.title}`,
        timestamp: Date.now(),
      });
    },
    taskUpdatedViaSocket: (state, action: PayloadAction<Task>) => {
      state.notifications.push({
        id: Date.now().toString(),
        type: "info",
        message: `Task updated: ${action.payload.title}`,
        timestamp: Date.now(),
      });
    },
  },
});

export const {
  socketConnected,
  socketDisconnected,
  addNotification,
  removeNotification,
  clearNotifications,
  taskCreatedViaSocket,
  taskUpdatedViaSocket,
} = socketSlice.actions;

export default socketSlice.reducer;
