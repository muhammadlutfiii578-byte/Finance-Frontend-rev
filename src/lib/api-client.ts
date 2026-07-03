import axios, { AxiosError } from 'axios';
import type { ApiError, ApiResponse } from '@/types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://finance-backend-production-9f5a.up.railway.app/api';

console.log("API_BASE_URL =", API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ledger_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ledger_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Unwraps an axios response that carries the backend's `ApiResponse<T>` envelope
 * ({ success, message, data }), returning just the inner `data` payload.
 *
 * Use this in api-services.ts instead of `.then((r) => r.data)`, which only
 * strips the axios wrapper and leaves the ApiResponse wrapper in place.
 *
 * Note: this does not check `success`. If the backend can return
 * `success: false` with an HTTP 200 status, add a check here, e.g.:
 *
 *   if (!res.data.success) throw new Error(res.data.message);
 */
export async function unwrap<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const res = await promise;
  return res.data.data;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;
    return apiError?.message ?? error.message ?? 'Terjadi kesalahan tak terduga.';
  }
  if (error instanceof Error) return error.message;
  return 'Terjadi kesalahan tak terduga.';
}
