import { notifications } from "@mantine/notifications";
import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";

export interface ApiError {
  status: number;
  message: string;
  title?: string;
  code?: string;
}

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

function flushQueue(error: unknown = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  pendingQueue = [];
}

const SKIP_REFRESH_URLS = [
  "/auth/login",
  "/auth/refresh-token",
  "/auth/reset-password",
  "/auth/check-session",
  "/users/activation",
];

const shouldSkipRefresh = (url?: string): boolean => {
  if (!url) return false;
  return SKIP_REFRESH_URLS.some((skip) => url.includes(skip));
};

const SILENT_ERROR_URLS = ["/auth/login", "/auth/check-session"];

const isSilentError = (url?: string): boolean => {
  if (!url) return false;
  return SILENT_ERROR_URLS.some((silent) => url.includes(silent));
};

async function handleRefreshFlow(originalRequest: InternalAxiosRequestConfig) {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingQueue.push({
        resolve: () => resolve(apiClient(originalRequest)),
        reject,
      });
    });
  }

  isRefreshing = true;

  try {
    await apiClient.post("/auth/refresh-token");
    flushQueue();
    return apiClient(originalRequest);
  } catch (refreshError) {
    flushQueue(refreshError);

    const { useAuthStore } = await import("../stores/auth");
    useAuthStore.getState().setCurrentSession(null);

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    return Promise.reject(refreshError);
  } finally {
    isRefreshing = false;
  }
}

function showErrorNotification(errorData: ApiError | undefined) {
  notifications.show({
    title: errorData?.title ?? "Erro na requisição",
    message: errorData?.message ?? "Ocorreu um erro. Tente novamente.",
    color: "var(--status-error)",
    position: "bottom-center",
    autoClose: 10000,
  });
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorData: ApiError = error.response?.data;
    const status: number = error.response?.status;
    const requestUrl: string = originalRequest?.url;

    const is401 = status === 401;
    const alreadyRetried = !!originalRequest._retry;

    if (is401 && !alreadyRetried && !shouldSkipRefresh(requestUrl)) {
      originalRequest._retry = true;
      return handleRefreshFlow(originalRequest);
    }

    if (is401 && requestUrl?.includes("/auth/reset-password/second-step")) {
      notifications.show({
        title: "Link expirado ou inválido",
        message:
          "O link de redefinição de senha expirou ou é inválido. Use o link enviado para o seu e-mail para redefinir sua senha.",
        color: "var(--status-warning)",
        position: "bottom-center",
        autoClose: false,
        withCloseButton: true,
      });
      return Promise.reject(new Error("Link de redefinição de senha inválido ou expirado."));
    }

    if (isSilentError(requestUrl)) {
      const silentError = new Error(errorData?.message ?? "Erro inesperado") as Error & {
        status?: number | null;
      };
      silentError.status = status ?? null;
      return Promise.reject(silentError);
    }

    showErrorNotification(errorData);
    const message = errorData?.message ?? "Erro inesperado";
    return Promise.reject(new Error(message));
  },
);
