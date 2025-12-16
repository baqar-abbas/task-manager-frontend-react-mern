import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./types";
import type { User } from "../../utils/types/api.types";
import SocketService from "../../services/socket";

const loadAuthFromStorage = (): Partial<AuthState> => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      // Connect socket if token exists
      try {
        SocketService.connect(token);
      } catch (socketError) {
        console.warn("Failed to connect socket on load:", socketError);
      }

      return {
        token,
        user: JSON.parse(userStr),
      };
    }
  } catch (error) {
    console.error("Failed to load auth from storage:", error);
  }

  return { token: null, user: null };
};

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  socketConnected: false, // Add socket connection state
  ...loadAuthFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.isLoading = false;

      // Save to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      // Connect socket with new token
      try {
        SocketService.connect(action.payload.token);
        state.socketConnected = true;
      } catch (socketError) {
        console.error("Failed to connect socket:", socketError);
        state.socketConnected = false;
        state.error = "Failed to establish real-time connection";
      }
    },
    logout: (state) => {
      // Disconnect socket first
      SocketService.disconnect();

      state.user = null;
      state.token = null;
      state.error = null;
      state.isLoading = false;
      state.socketConnected = false;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null; // Clear error when loading starts
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.socketConnected = action.payload;
      if (action.payload) {
        state.error = null; // Clear socket errors when connected
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add action to manually reconnect socket
    reconnectSocket: (state) => {
      if (state.token) {
        try {
          SocketService.connect(state.token);
          state.socketConnected = true;
          state.error = null;
        } catch {
          state.socketConnected = false;
          state.error = "Failed to reconnect socket";
        }
      }
    },
  },
});

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  updateUser,
  setSocketConnected,
  clearError,
  reconnectSocket,
} = authSlice.actions;

export default authSlice.reducer;
