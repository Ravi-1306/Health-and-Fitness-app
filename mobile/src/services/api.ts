import axios, { AxiosInstance } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ApiResponse, AuthTokens, User, Workout } from '../types';

// Use your computer's IP address instead of localhost for mobile devices
// Change this to match your network IP (run 'ipconfig' on Windows to find it)
const API_BASE_URL = __DEV__ ? 'http://192.168.68.65:3000/api' : 'https://api.fittrack.app';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken } = response.data;
            await SecureStore.setItemAsync('accessToken', accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, log out user
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('user');
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.client.get(url, { params }).then((res) => res.data);
  }

  post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.post(url, data).then((res) => res.data);
  }

  patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.client.patch(url, data).then((res) => res.data);
  }

  delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.client.delete(url).then((res) => res.data);
  }
}

const apiClient = new ApiClient();

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; profile?: any }) =>
    apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/register', data),

  login: (email: string, password: string) =>
    apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/login', {
      email,
      password,
    }),

  logout: () => apiClient.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken }),
};

// User API
export const userApi = {
  getProfile: () => apiClient.get<User>('/user/profile'),

  updateProfile: (data: Partial<User>) => apiClient.patch<User>('/user/profile', data),

  deleteAccount: () => apiClient.delete('/user/profile'),
};

// Workout API
export const workoutApi = {
  list: (params?: { from?: string; to?: string; exercise?: string }) =>
    apiClient.get<Workout[]>('/workouts', params),

  getById: (id: string) => apiClient.get<Workout>(`/workouts/${id}`),

  create: (data: Partial<Workout>) => apiClient.post<Workout>('/workouts', data),

  update: (id: string, data: Partial<Workout>) => apiClient.patch<Workout>(`/workouts/${id}`, data),

  delete: (id: string) => apiClient.delete(`/workouts/${id}`),

  sync: (workouts: Workout[]) => apiClient.post<{ synced: number }>('/workouts/sync', { workouts }),

  export: (format: 'csv' | 'json') => apiClient.get(`/workouts/export?format=${format}`),
};

// AI API
export const aiApi = {
  generatePlan: (userData: any) => apiClient.post<{ plan: any }>('/ai/generate-plan', userData),

  chat: (message: string, context?: any) =>
    apiClient.post<{ response: string }>('/ai/chat', { message, context }),

  getWorkoutSuggestion: (workoutHistory: any[]) =>
    apiClient.post<{ suggestion: any }>('/ai/workout-suggestion', {
      workoutHistory,
    }),
};

export default apiClient;
