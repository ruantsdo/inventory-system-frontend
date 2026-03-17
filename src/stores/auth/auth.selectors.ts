import type { AuthState } from "./";

export const selectIsAuthenticated = (state: AuthState) => !!state.user;
export const selectHasCheckedAuth = (state: AuthState) => state.hasCheckedAuth;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectUser = (state: AuthState) => state.user;
export const selectErrorMessage = (state: AuthState) => state.errorMessage;
