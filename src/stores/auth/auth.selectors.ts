import type { AuthState } from "./";

export const selectIsAuthenticated = (state: AuthState) => !!state.currentSession;
export const selectHasCheckedAuth = (state: AuthState) => state.hasCheckedAuth;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectCurrentSession = (state: AuthState) => state.currentSession;
export const selectUser = (state: AuthState) => state.currentSession?.user ?? null;
export const selectRoles = (state: AuthState) => state.currentSession?.roles ?? [];
export const selectErrorMessage = (state: AuthState) => state.errorMessage;
