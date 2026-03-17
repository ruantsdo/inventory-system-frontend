import { notifications } from "@mantine/notifications";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  LoginRequest,
  ResetPasswordFirstStepRequest,
  ResetPasswordSecondStepRequest,
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
          const message = error instanceof Error ? error.message : "Credenciais inválidas";

          notifications.show({
            title: "Erro ao fazer login",
            message: message,
            color: "var(--status-error)",
            position: "bottom-center",
            autoClose: false,
            withCloseButton: true,
          });

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

          set({
            user: {
              fullName: persistedUser.fullName,
              email: persistedUser.email,
              id: userFromServer.id,
              role: userFromServer.role,
              permissions: userFromServer.permissions,
            },
          });
        } catch {
          set({ user: null, errorMessage: null });
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
        try {
          await authService.logout();
        } catch {
          notifications.show({
            title: "Erro ao sair",
            message:
              "Não foi possível encerrar a sessão no servidor. Você foi desconectado localmente.",
            color: "var(--status-warning)",
            position: "bottom-center",
            autoClose: 8000,
          });
        } finally {
          set({ user: null, hasCheckedAuth: true, errorMessage: null });
        }
      },

      resetPasswordFirstStep: async (data: ResetPasswordFirstStepRequest) => {
        set({ isLoading: true, errorMessage: null });

        try {
          await authService.resetPasswordFirstStep(data);

          notifications.show({
            title: "Código enviado",
            message: "O link de recuperação foi enviado para o seu e-mail.",
            color: "var(--status-success)",
            position: "bottom-center",
            autoClose: false,
            withCloseButton: true,
          });

          return true;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Tente novamente em alguns instantes.";

          notifications.show({
            title: "Erro ao enviar código",
            message: message,
            color: "var(--status-error)",
            position: "bottom-center",
            autoClose: 10000,
          });
          set({ errorMessage: message });

          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      resetPasswordSecondStep: async (data: ResetPasswordSecondStepRequest, token: string) => {
        set({ isLoading: true, errorMessage: null });

        try {
          await authService.resetPasswordSecondStep(data, token);
          return true;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erro inesperado ao redefinir senha.";
          set({ errorMessage: message });
          return false;
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
