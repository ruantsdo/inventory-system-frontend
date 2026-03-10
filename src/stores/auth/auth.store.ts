import { notifications } from "@mantine/notifications";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  LoginRequest,
  resetPasswordFirstStepRequest,
  resetPasswordSecondStepRequest,
} from "../../schemas/auth";
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

          set({ user, hasCheckedAuth: true });

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
          const userFromServer = await authService.checkSession();
          set({ user: userFromServer });
        } catch (error) {
          set({ user: null, errorMessage: "Sessão expirada." });
          notifications.show({
            title: "Sessão expirada",
            message: "A sessão expirou. Por favor, faça login novamente.",
            color: "var(--status-warning)",
            position: "bottom-center",
            autoClose: 10000,
          });
        } finally {
          set({ hasCheckedAuth: true, isLoading: false });
        }
      },

      logout: async () => {
        await authService.logout();
        set({ user: null, hasCheckedAuth: true });
      },

      resetPasswordFirstStep: async (data: resetPasswordFirstStepRequest) => {
        set({ isLoading: true, errorMessage: null });

        try {
          await authService.resetPasswordFirstStep(data);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Erro inesperado";
          set({ errorMessage: message });
        } finally {
          set({ isLoading: false });
        }
      },

      resetPasswordSecondStep: async (data: resetPasswordSecondStepRequest, token: string) => {
        set({ isLoading: true, errorMessage: null });

        try {
          await authService.resetPasswordSecondStep(data, token);
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
