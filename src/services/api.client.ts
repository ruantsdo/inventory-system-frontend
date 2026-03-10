import { notifications } from "@mantine/notifications";
import axios from "axios";

export interface ApiError {
  status: number;
  message: string;
  title?: string;
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

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const errorData = error.response?.data;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      errorData?.code === "INVALID_CREDENTIALS" ||
      originalRequest.url?.includes("/auth/login")
    ) {
      notifications.show({
        title: errorData?.title,
        message: errorData?.message ?? "Erro na requisição",
        color: "var(--status-error)",
        position: "bottom-center",
        autoClose: 10000,
      });
      return Promise.reject(error);
    }

    originalRequest._retry = true;

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
      useAuthStore.getState().setUser(null);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
