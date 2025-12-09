import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../../utils/types/api.types";

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest extends LoginCredentials {}
export interface RegisterRequest extends RegisterCredentials {}
