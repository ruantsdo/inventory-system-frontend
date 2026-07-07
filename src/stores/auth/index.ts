import {
  selectCurrentSession,
  selectErrorMessage,
  selectHasCheckedAuth,
  selectIsAuthenticated,
  selectIsLoading,
  selectRoles,
  selectUser,
} from "./auth.selectors";
import { useAuthStore } from "./auth.store";
import type { AuthState } from "./auth.types";

export {
  useAuthStore,
  selectIsAuthenticated,
  selectHasCheckedAuth,
  selectIsLoading,
  selectCurrentSession,
  selectUser,
  selectRoles,
  selectErrorMessage,
};
export type { AuthState };

