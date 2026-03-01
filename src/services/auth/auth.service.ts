import type { ForgotPasswordRequest, ResetPasswordRequest } from "../../schemas/auth";
import type { AuthUser } from "../../types/user";
import { request } from "../api.client";
import type { LoginDTO } from "./";

export const authService = {
  async login(data: LoginDTO): Promise<AuthUser> {
    return request<AuthUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async me(): Promise<AuthUser> {
    return request<AuthUser>("/auth/me", {
      method: "GET",
    });
  },

  async logout(): Promise<void> {
    await request<void>("/auth/logout", {
      method: "POST",
    });
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    return request<void>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async resetPassword(data: ResetPasswordRequest, token: string): Promise<void> {
    return request<void>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ ...data, token }),
    });
  },
};
