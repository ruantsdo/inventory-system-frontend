import { notifications } from "@mantine/notifications";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  LoginRequest,
  ResetPasswordFirstStepRequest,
  ResetPasswordSecondStepRequest,
} from "../../schemas/auth";
import { authService } from "../../services/auth";
import { getAllFacilitiesForSession } from "../../services/facilities";
import type { AuthState } from "./";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      const syncSessionWithServer = async (options: { isRevalidation?: boolean }) => {
        const persistedSession = get().currentSession;
        if (!persistedSession) {
          set({ hasCheckedAuth: true });
          return;
        }

        if (options.isRevalidation) {
          if (get().isRevalidating) return;
          set({ isRevalidating: true });
        } else {
          if (get().hasCheckedAuth) return;
          set({ isLoading: true });
        }

        try {
          const sessionFromServer = await authService.checkSession();

          set({
            currentSession: {
              ...sessionFromServer,
              user: {
                ...sessionFromServer.user,
                fullName: sessionFromServer.user.fullName || persistedSession.user.fullName,
              },
              facilities: persistedSession.facilities ?? [],
              activeContext: {
                ...sessionFromServer.activeContext,
                ...persistedSession.activeContext,
              },
            },
          });
        } catch (error) {
          const status =
            (error as { response?: { status?: number } })?.response?.status ??
            (error as { status?: number })?.status ??
            null;

          const isNetworkError = status === null;
          const title = isNetworkError
            ? "Servidor indisponível"
            : options.isRevalidation
              ? "Sessão encerrada"
              : "Sessão expirada";
          const message = isNetworkError
            ? "Não foi possível conectar ao servidor. Por favor, aguarde alguns instantes e tente novamente."
            : options.isRevalidation
              ? "Sua sessão não é mais válida. Por favor, faça login novamente."
              : "A sessão expirou. Por favor, faça login novamente.";

          set({ currentSession: null, errorMessage: null, hasCheckedAuth: true });
          notifications.show({
            title,
            message,
            color: "var(--status-warning)",
            position: "bottom-center",
            autoClose: 10000,
          });
        } finally {
          if (options.isRevalidation) {
            set({ isRevalidating: false });
          } else {
            set({ hasCheckedAuth: true, isLoading: false });
          }
        }
      };

      return {
        currentSession: null,
        isLoading: false,
        isRevalidating: false,
        hasCheckedAuth: false,
        errorMessage: null,

        setCurrentSession: (currentSession) => {
          set({ currentSession });
        },

        login: async ({ credential, password, rememberMe }: LoginRequest) => {
          set({ isLoading: true, errorMessage: null });

          try {
            const session = await authService.login({ credential, password });

            const isSuperUser =
              session.roles.some((r) => r.name === "ADMIN_ROOT") ||
              session.roles.some((r) => r.name === "SUPER_ADMIN");

            if (isSuperUser) {
              session.facilities.unshift({
                id: "ALL",
                name: "Todas as unidades",
              });
              session.activeContext.facilityId = "ALL";
              session.activeContext.isGlobal = true;
            }

            if (session.facilities.length === 0) {
              const allFacilities = await getAllFacilitiesForSession();
              session.facilities = allFacilities;
            }

            session.activeContext = {
              facilityId: session.facilities[0]?.id || null,
              facilityName: session.facilities[0]?.name || null,
              isGlobal: session.activeContext?.isGlobal || false,
            };

            set({ currentSession: session, hasCheckedAuth: true });

            if (rememberMe) {
              localStorage.setItem("rememberMe", JSON.stringify({ credential, rememberMe: true }));
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
          return syncSessionWithServer({ isRevalidation: false });
        },

        revalidateSession: async () => {
          return syncSessionWithServer({ isRevalidation: true });
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
      };
    },
    {
      name: "auth-storage",
      partialize: (state) => ({
        currentSession: state.currentSession,
      }),
    },
  ),
);
