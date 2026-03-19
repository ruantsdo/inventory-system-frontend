import type {
  LoginRequest,
  ResetPasswordFirstStepRequest,
  ResetPasswordSecondStepRequest,
} from "../../schemas/auth";
import type { AuthUser } from "./";

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hasCheckedAuth: boolean;
  errorMessage: string | null;

  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  checkAuth: () => Promise<void>;
  resetPasswordFirstStep: (data: ResetPasswordFirstStepRequest) => Promise<boolean>;
  resetPasswordSecondStep: (
    data: ResetPasswordSecondStepRequest,
    token: string,
  ) => Promise<boolean>;
}
