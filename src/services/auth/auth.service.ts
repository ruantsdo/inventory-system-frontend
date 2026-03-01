import type { ForgotPasswordRequest, ResetPasswordRequest } from "../../schemas/auth";
import type { AuthUser } from "../../types/user";
import type { LoginDTO } from "./";

const API_URL = import.meta.env.VITE_API_URL;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw {
      status: response.status,
      message: errorBody?.message || "Erro na requisição",
    };
  }

  return response.json();
}

export const authService = {
  async login(data: LoginDTO): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (data.credential !== "11111111111" || data.password !== "123456") {
      throw new Error("Credenciais inválidas");
    }

    return {
      uuid: "1",
      name: "Administrador",
      email: "admin@email.com",
      role: "admin",
    } as AuthUser;

    /*
    return request<AuthUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    */
  },

  async me(): Promise<AuthUser> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      uuid: "1",
      name: "Administrador",
      email: "admin@email.com",
      role: "admin",
    };

    /*
    return request<AuthUser>("/auth/me", {
      method: "GET",
    });
    */
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return;

    /*
    await request<void>("/auth/logout", {
      method: "POST",
    });
    */
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return;

    /*
    return request<void>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
    */
  },

  async resetPassword(data: ResetPasswordRequest, token: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (token !== "123456") {
      throw new Error("Token inválido");
    }

    return;

    /*
    return request<void>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
    */
  },
};
