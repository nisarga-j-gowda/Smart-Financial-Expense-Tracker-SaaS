import axios from 'axios';
import {
  AuthResponse,
  UserProfile,
  Transaction,
  Budget,
  Goal,
  RecurringTransaction,
  NotificationItem,
  FinancialSummary,
  CategorySummary,
  MonthlyTrend,
  FinancialInsight,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (data: { fullName: string; email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },
  getMe: async (): Promise<{ user: UserProfile }> => {
    const res = await api.get<{ user: UserProfile }>('/auth/me');
    return res.data;
  },
  updateProfile: async (data: Partial<UserProfile>): Promise<{ user: UserProfile; message: string }> => {
    const res = await api.put<{ user: UserProfile; message: string }>('/auth/profile', data);
    return res.data;
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
    const res = await api.put<{ message: string }>('/auth/change-password', data);
    return res.data;
  },
};

export const transactionService = {
  getAll: async (params?: Record<string, any>): Promise<Transaction[]> => {
    const res = await api.get<Transaction[]>('/transactions', { params });
    return res.data;
  },
  create: async (data: Partial<Transaction>): Promise<Transaction> => {
    const res = await api.post<Transaction>('/transactions', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
    const res = await api.put<Transaction>(`/transactions/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<{ message: string; id: string }> => {
    const res = await api.delete<{ message: string; id: string }>(`/transactions/${id}`);
    return res.data;
  },
};

export const budgetService = {
  getAll: async (): Promise<Budget[]> => {
    const res = await api.get<Budget[]>('/budgets');
    return res.data;
  },
  create: async (data: { category: string; limitAmount: number; month?: string }): Promise<Budget> => {
    const res = await api.post<Budget>('/budgets', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Budget>): Promise<Budget> => {
    const res = await api.put<Budget>(`/budgets/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/budgets/${id}`);
    return res.data;
  },
};

export const goalService = {
  getAll: async (): Promise<Goal[]> => {
    const res = await api.get<Goal[]>('/goals');
    return res.data;
  },
  create: async (data: Partial<Goal>): Promise<Goal> => {
    const res = await api.post<Goal>('/goals', data);
    return res.data;
  },
  update: async (id: string, data: Partial<Goal>): Promise<Goal> => {
    const res = await api.put<Goal>(`/goals/${id}`, data);
    return res.data;
  },
  addMoney: async (id: string, amount: number): Promise<Goal> => {
    const res = await api.put<Goal>(`/goals/${id}/add-money`, { amount });
    return res.data;
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/goals/${id}`);
    return res.data;
  },
};

export const recurringService = {
  getAll: async (): Promise<RecurringTransaction[]> => {
    const res = await api.get<RecurringTransaction[]>('/recurring');
    return res.data;
  },
  create: async (data: Partial<RecurringTransaction>): Promise<RecurringTransaction> => {
    const res = await api.post<RecurringTransaction>('/recurring', data);
    return res.data;
  },
  update: async (id: string, data: Partial<RecurringTransaction>): Promise<RecurringTransaction> => {
    const res = await api.put<RecurringTransaction>(`/recurring/${id}`, data);
    return res.data;
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/recurring/${id}`);
    return res.data;
  },
};

export const notificationService = {
  getAll: async (): Promise<NotificationItem[]> => {
    const res = await api.get<NotificationItem[]>('/notifications');
    return res.data;
  },
  markRead: async (id: string): Promise<{ message: string }> => {
    const res = await api.put<{ message: string }>(`/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async (): Promise<{ message: string }> => {
    const res = await api.put<{ message: string }>('/notifications/read-all');
    return res.data;
  },
};

export const analyticsService = {
  getOverview: async (): Promise<FinancialSummary> => {
    const res = await api.get<FinancialSummary>('/analytics/overview');
    return res.data;
  },
  getCategories: async (): Promise<CategorySummary[]> => {
    const res = await api.get<CategorySummary[]>('/analytics/categories');
    return res.data;
  },
  getMonthlyTrends: async (): Promise<MonthlyTrend[]> => {
    const res = await api.get<MonthlyTrend[]>('/analytics/monthly');
    return res.data;
  },
  getInsights: async (): Promise<FinancialInsight[]> => {
    const res = await api.get<FinancialInsight[]>('/analytics/insights');
    return res.data;
  },
};

export default api;
