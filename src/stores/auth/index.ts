import type { AuthUser, UserRole } from "../../types/user";
import {
  selectErrorMessage,
  selectHasCheckedAuth,
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
} from "./auth.selectors";
import { useAuthStore } from "./auth.store";
import type { AuthState } from "./auth.types";

export {
  useAuthStore,
  selectIsAuthenticated,
  selectHasCheckedAuth,
  selectIsLoading,
  selectUser,
  selectErrorMessage,
};
export type { AuthState, AuthUser, UserRole };
