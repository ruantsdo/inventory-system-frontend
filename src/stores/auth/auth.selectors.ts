import type { AuthState } from "./";

export const selectIsAuthenticated = (state: AuthState) => !!state.user;
export const selectHasCheckedAuth = (state: AuthState) => state.hasCheckedAuth;
