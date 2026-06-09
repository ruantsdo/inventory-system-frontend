import type {
  ResetPasswordFirstStepRequest,
  ResetPasswordSecondStepRequest,
} from "../../schemas/auth";
import type { AuthSession, AuthSessionResponse } from "../../types/permissions";
import { apiClient } from "../api.client";
import type { LoginDTO } from "./";

export const authService = {
  async login(data: LoginDTO): Promise<AuthSession> {
    const response = await apiClient.post<{ status: string; session: AuthSession }>(
      "/auth/login",
      data,
    );
    const session = response.data.session;

    if (!session) {
      throw new Error("Credenciais inválidas ou conta inativa.");
    }

    return session;
  },

  async checkSession(): Promise<AuthSession> {
    const response = await apiClient.get<AuthSessionResponse>("/auth/check-session");
    const session = response.data.session;

    if (!session) {
      throw new Error("Sessão não encontrada.");
    }

    return session;
  },

  async refreshToken(): Promise<void> {
    await apiClient.post("/auth/refresh-token");
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async resetPasswordFirstStep(data: ResetPasswordFirstStepRequest): Promise<void> {
    await apiClient.post("/auth/reset-password/first-step", data);
  },

  async resetPasswordSecondStep(
    data: ResetPasswordSecondStepRequest,
    token: string,
  ): Promise<void> {
    await apiClient.post("/auth/reset-password/second-step", { ...data, token });
  },

  async confirmActivation(
    data: ResetPasswordSecondStepRequest,
    token: string,
  ): Promise<void> {
    await apiClient.post("/api/users/activation/confirm", { ...data, token });
  },
};
