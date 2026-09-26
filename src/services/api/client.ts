import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { readSession, writeSession } from "./session";

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 500, code = "request_failed") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const mockMode = import.meta.env.VITE_USE_MOCK !== "false";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  timeout: 15000,
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshHandler: (() => Promise<string | null>) | null = null;

export function setRefreshHandler(handler: () => Promise<string | null>) {
  refreshHandler = handler;
}

api.interceptors.request.use((config) => {
  const session = readSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; code?: string }>) => {
    const original = error.config as RetryConfig | undefined;
    if (error.response?.status === 401 && original && !original._retry && refreshHandler) {
      original._retry = true;
      const token = await refreshHandler();
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
      writeSession(null);
    }
    const message = error.response?.data?.message || error.message || "Something went wrong.";
    const code = error.response?.data?.code || "request_failed";
    return Promise.reject(new ApiError(message, error.response?.status ?? 500, code));
  },
);

export function wait(ms = 280) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
