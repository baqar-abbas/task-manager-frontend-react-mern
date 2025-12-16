import type { User } from "../../utils/types/api.types";

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  socketConnected: boolean;
}
