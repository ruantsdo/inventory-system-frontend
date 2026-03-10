import type {
  LoginRequest,
  resetPasswordFirstStepRequest,
  resetPasswordSecondStepRequest,
} from "../../schemas/auth";
import type { AuthUser } from "./";

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hasCheckedAuth: boolean;
  errorMessage: string | null;

  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  checkAuth: () => Promise<void>;
  resetPasswordFirstStep: (data: resetPasswordFirstStepRequest) => Promise<void>;
  resetPasswordSecondStep: (data: resetPasswordSecondStepRequest, token: string) => Promise<void>;
}
