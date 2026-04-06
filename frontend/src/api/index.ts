import axios from 'axios';
import type {
  LoginRequest,
  TokenResponse,
  SalesItem,
  SalesStats,
  PredictRequest,
  PredictResponse,
} from '../types';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → clear auth and redirect
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const res = await api.post<TokenResponse>('/auth/login', data);
    return res.data;
  },
};

export const salesApi = {
  getAll: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<SalesItem[]> => {
    const res = await api.get<SalesItem[]>('/sales', { params });
    return res.data;
  },
  getStats: async (): Promise<SalesStats> => {
    const res = await api.get<SalesStats>('/sales/stats');
    return res.data;
  },
};

export const mlApi = {
  predict: async (data: PredictRequest): Promise<PredictResponse> => {
    const res = await api.post<PredictResponse>('/predict', data);
    return res.data;
  },
};

export default api;
