import { notifications } from "@mantine/notifications";
import CryptoJS from "crypto-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  LoginRequest,
  ResetPasswordFirstStepRequest,
  ResetPasswordSecondStepRequest,
} from "../../schemas/auth";
import { authService } from "../../services/auth";
import type { AuthSession } from "../../types/permissions";
import type { AuthState } from "./";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      isLoading: false,
      hasCheckedAuth: false,
      isRevalidating: false,
      errorMessage: null,

      setCurrentSession: (session: AuthSession | null) => {
        set({ currentSession: session });
      },

      login: async (data: LoginRequest) => {
        set({ isLoading: true, errorMessage: null });

        const { credential, password, rememberMe } = data;

        try {
          const session = await authService.login({ credential, password });

          session.activeContext = {
            facilityId: session.facilities[0]?.id || null,
            facilityName: session.facilities[0]?.name || null,
            isGlobal: session.activeContext?.isGlobal || false,
          };

          set({ currentSession: session, hasCheckedAuth: true });

          console.log("session", session);

          if (rememberMe) {
            const encryptedParams = CryptoJS.AES.encrypt(
              JSON.stringify({ credential, rememberMe }),
              import.meta.env.VITE_STORAGE_SECRET || "inventory-system-secret-key",
            ).toString();
            localStorage.setItem("rememberMe", encryptedParams);
          } else {
            localStorage.removeItem("rememberMe");
          }

          notifications.clean();
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

        const persistedSession = get().currentSession;
        if (!persistedSession) {
          set({ hasCheckedAuth: true });
          return;
        }

        set({ isLoading: true });

        try {
          const sessionFromServer = await authService.checkSession();

          set({
            currentSession: {
              ...sessionFromServer,
              user: {
                ...sessionFromServer.user,
                fullName: sessionFromServer.user.fullName || persistedSession.user.fullName,
              },
            },
          });
        } catch (error) {
          const status =
            (error as { response?: { status?: number } })?.response?.status ??
            (error as { status?: number })?.status ??
            null;

          const isNetworkError = status === null;
          const title = isNetworkError ? "Servidor indisponível" : "Sessão expirada";
          const message = isNetworkError
            ? "Não foi possível conectar ao servidor. Por favor, aguarde alguns instantes e tente novamente."
            : "A sessão expirou. Por favor, faça login novamente.";

          set({ currentSession: null, errorMessage: null });
          notifications.show({
            title,
            message,
            color: "var(--status-warning)",
            position: "bottom-center",
            autoClose: 10000,
          });
        } finally {
          set({ hasCheckedAuth: true, isLoading: false });
        }
      },

      revalidateSession: async () => {
        if (get().isRevalidating) return;

        const persistedSession = get().currentSession;
        if (!persistedSession) return;

        set({ isRevalidating: true });

        try {
          const sessionFromServer = await authService.checkSession();

          set({
            currentSession: {
              ...sessionFromServer,
              user: {
                ...sessionFromServer.user,
                fullName: sessionFromServer.user.fullName || persistedSession.user.fullName,
              },
            },
          });
        } catch (error) {
          const status =
            (error as { response?: { status?: number } })?.response?.status ??
            (error as { status?: number })?.status ??
            null;

          const isNetworkError = status === null;
          const title = isNetworkError ? "Servidor indisponível" : "Sessão encerrada";
          const message = isNetworkError
            ? "Não foi possível conectar ao servidor. Por favor, aguarde alguns instantes e tente novamente."
            : "Sua sessão não é mais válida. Por favor, faça login novamente.";

          set({ currentSession: null, hasCheckedAuth: true, errorMessage: null });
          notifications.show({
            title,
            message,
            color: "var(--status-warning)",
            position: "bottom-center",
            autoClose: 10000,
          });
        } finally {
          set({ isRevalidating: false });
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
          set({ currentSession: null, hasCheckedAuth: true, errorMessage: null });
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

      confirmActivation: async (data: ResetPasswordSecondStepRequest, token: string) => {
        set({ isLoading: true, errorMessage: null });

        try {
          await authService.confirmActivation(data, token);
          return true;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Erro inesperado ao ativar conta.";
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
        currentSession: state.currentSession,
      }),
    },
  ),
);
