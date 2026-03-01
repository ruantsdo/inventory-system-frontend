const API_URL = import.meta.env.VITE_API_URL;

import { notifications } from "@mantine/notifications";

interface ApiError {
  status: number;
  message: string;
  title?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const error: ApiError = {
      status: response.status,
      message: errorBody?.message ?? "Erro na requisição",
      title: errorBody?.title,
    };

    notifications.show({
      title: error.title,
      message: error.message,
      color: "var(--status-error)",
      position: "bottom-center",
      autoClose: 10000,
    });

    throw error;
  }

  return response.json() as Promise<T>;
}

export { request };
export type { ApiError };
