import { notifications } from "@mantine/notifications";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ForgotPasswordRequest, LoginRequest, ResetPasswordRequest } from "../../schemas/auth";
import { authService } from "../../services/auth";
import type { AuthState, AuthUser } from "./";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      hasCheckedAuth: false,
      errorMessage: null,

      setUser: (user: AuthUser | null) => {
        set({ user });
      },

      login: async (data: LoginRequest) => {
        set({ isLoading: true, errorMessage: null });

        const { credential, password, rememberMe } = data;

        try {
          const user = await authService.login({ credential, password });

          set({
            user,
            hasCheckedAuth: true,
          });

          if (rememberMe) {
            localStorage.setItem("rememberMe", JSON.stringify({ credential, rememberMe }));
          } else {
            localStorage.removeItem("rememberMe");
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erro inesperado";

          set({ errorMessage: message });
        } finally {
          set({ isLoading: false });
        }
      },

      checkAuth: async () => {
        if (get().hasCheckedAuth) return;

        const persistedUser = get().user;
        if (!persistedUser) {
          set({ hasCheckedAuth: true });
          return;
        }

        set({ isLoading: true });

        try {
          const user = await authService.me();
          set({ user });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erro inesperado";

          set({ user: null, errorMessage: message });
        } finally {
          set({
            hasCheckedAuth: true,
            isLoading: false,
          });
        }
      },

      logout: async () => {
        await authService.logout();

        set({
          user: null,
          hasCheckedAuth: true,
        });
      },

      forgotPassword: async (data: ForgotPasswordRequest) => {
        set({ isLoading: true, errorMessage: null });

        try {
          await authService.forgotPassword(data);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erro inesperado";

          set({ errorMessage: message });
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (data: ResetPasswordRequest, token: string) => {
        set({ isLoading: true, errorMessage: null });

        try {
          await authService.resetPassword(data, token);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erro inesperado";

          set({ errorMessage: message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    },
  ),
);
