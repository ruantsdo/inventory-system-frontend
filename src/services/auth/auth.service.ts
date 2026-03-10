import type {
  resetPasswordFirstStepRequest,
  resetPasswordSecondStepRequest,
} from "../../schemas/auth";
import type { AuthUser } from "../../types/user";
import { apiClient } from "../api.client";
import type { LoginDTO } from "./";

export const authService = {
  async login(data: LoginDTO): Promise<AuthUser> {
    const response = await apiClient.post<AuthUser>("/auth/login", data);
    return response.data;
  },

  async checkSession(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>("/auth/check-session");
    return response.data;
  },

  async refreshToken(): Promise<void> {
    await apiClient.post("/auth/refresh-token");
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async resetPasswordFirstStep(data: resetPasswordFirstStepRequest): Promise<void> {
    await apiClient.post("/auth/reset-password/first-step", data);
  },

  async resetPasswordSecondStep(
    data: resetPasswordSecondStepRequest,
    token: string,
  ): Promise<void> {
    await apiClient.post("/auth/reset-password/second-step", { ...data, token });
  },
};
