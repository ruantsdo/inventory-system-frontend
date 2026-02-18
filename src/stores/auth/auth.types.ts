import type { ForgotPasswordRequest, LoginRequest, ResetPasswordRequest } from "../../schemas/auth";
import type { AuthUser } from "./";

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hasCheckedAuth: boolean;
  errorMessage: string | null;

  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  checkAuth: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest, token: string) => Promise<void>;
}
