import type {
  LoginRequest,
  ResetPasswordFirstStepRequest,
  ResetPasswordSecondStepRequest,
} from "../../schemas/auth";
import type { AuthSession } from "../../types/permissions";

export interface AuthState {
  currentSession: AuthSession | null;
  isLoading: boolean;
  hasCheckedAuth: boolean;
  errorMessage: string | null;

  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentSession: (session: AuthSession | null) => void;
  checkAuth: () => Promise<void>;
  resetPasswordFirstStep: (data: ResetPasswordFirstStepRequest) => Promise<boolean>;
  resetPasswordSecondStep: (
    data: ResetPasswordSecondStepRequest,
    token: string,
  ) => Promise<boolean>;
}
