import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
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
import {
  transactionService,
  budgetService,
  goalService,
  recurringService,
  notificationService,
  analyticsService,
} from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from '../components/common/Toast';

interface FinancialContextType {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  recurring: RecurringTransaction[];
  notifications: NotificationItem[];
  summary: FinancialSummary | null;
  categories: CategorySummary[];
  monthlyTrends: MonthlyTrend[];
  insights: FinancialInsight[];
  isLoading: boolean;
  refreshData: () => Promise<void>;

  // Transaction Actions
  addTransaction: (data: Partial<Transaction>) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Budget Actions
  addBudget: (data: { category: string; limitAmount: number }) => Promise<void>;
  updateBudget: (id: string, data: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;

  // Goal Actions
  addGoal: (data: Partial<Goal>) => Promise<void>;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
  addMoneyToGoal: (id: string, amount: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  // Recurring Actions
  addRecurring: (data: Partial<RecurringTransaction>) => Promise<void>;
  updateRecurring: (id: string, data: Partial<RecurringTransaction>) => Promise<void>;
  deleteRecurring: (id: string) => Promise<void>;

  // Notifications
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Formatting helper
  formatINR: (amount: number) => string;

  // Active Modals state triggers
  isAddTransactionOpen: boolean;
  setIsAddTransactionOpen: (open: boolean) => void;
  isAddBudgetOpen: boolean;
  setIsAddBudgetOpen: (open: boolean) => void;
  isAddGoalOpen: boolean;
  setIsAddGoalOpen: (open: boolean) => void;
  isAddRecurringOpen: boolean;
  setIsAddRecurringOpen: (open: boolean) => void;
  editingTransaction: Transaction | null;
  setEditingTransaction: (t: Transaction | null) => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const formatINR = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal controls
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddRecurringOpen, setIsAddRecurringOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const refreshData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [txList, bgList, glList, rcList, ntList, sumData, catData, trendData, insData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
        goalService.getAll(),
        recurringService.getAll(),
        notificationService.getAll(),
        analyticsService.getOverview(),
        analyticsService.getCategories(),
        analyticsService.getMonthlyTrends(),
        analyticsService.getInsights(),
      ]);

      setTransactions(txList);
      setBudgets(bgList);
      setGoals(glList);
      setRecurring(rcList);
      setNotifications(ntList);
      setSummary(sumData);
      setCategories(catData);
      setMonthlyTrends(trendData);
      setInsights(insData);
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, refreshData]);

  // Transaction CRUD
  const addTransaction = async (data: Partial<Transaction>) => {
    try {
      await transactionService.create(data);
      addToast('Transaction Added', `${data.type === 'income' ? 'Income' : 'Expense'} recorded successfully.`);
      await refreshData();
    } catch (error: any) {
      addToast('Error Adding Transaction', error.response?.data?.message || 'Failed to save transaction', 'error');
      throw error;
    }
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    try {
      await transactionService.update(id, data);
      addToast('Transaction Updated', 'Changes saved successfully.');
      await refreshData();
    } catch (error: any) {
      addToast('Error Updating Transaction', error.response?.data?.message || 'Failed to update transaction', 'error');
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.delete(id);
      addToast('Transaction Removed', 'Transaction deleted from record.');
      await refreshData();
    } catch (error: any) {
      addToast('Error Deleting Transaction', 'Failed to delete transaction', 'error');
    }
  };

  // Budget CRUD
  const addBudget = async (data: { category: string; limitAmount: number }) => {
    try {
      await budgetService.create({ ...data, month: selectedMonth });
      addToast('Budget Set', `New monthly limit set for ${data.category}.`);
      await refreshData();
    } catch (error: any) {
      addToast('Error Setting Budget', error.response?.data?.message || 'Failed to save budget', 'error');
    }
  };

  const updateBudget = async (id: string, data: Partial<Budget>) => {
    try {
      await budgetService.update(id, data);
      addToast('Budget Updated', 'Limit updated successfully.');
      await refreshData();
    } catch (error: any) {
      addToast('Error Updating Budget', 'Failed to update budget', 'error');
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await budgetService.delete(id);
      addToast('Budget Removed', 'Category budget deleted.');
      await refreshData();
    } catch (error: any) {
      addToast('Error Deleting Budget', 'Failed to delete budget', 'error');
    }
  };

  // Goal CRUD
  const addGoal = async (data: Partial<Goal>) => {
    try {
      await goalService.create(data);
      addToast('Goal Created', `Savings target "${data.name}" added.`);
      await refreshData();
    } catch (error: any) {
      addToast('Error Creating Goal', error.response?.data?.message || 'Failed to save goal', 'error');
    }
  };

  const updateGoal = async (id: string, data: Partial<Goal>) => {
    try {
      await goalService.update(id, data);
      addToast('Goal Updated', 'Savings target modified successfully.');
      await refreshData();
    } catch (error: any) {
      addToast('Error Updating Goal', 'Failed to update goal', 'error');
    }
  };

  const addMoneyToGoal = async (id: string, amount: number) => {
    try {
      const updated = await goalService.addMoney(id, amount);
      addToast('Funds Added', `Added ${formatINR(amount)} to "${updated.name}".`);
      await refreshData();
    } catch (error: any) {
      addToast('Error Adding Funds', error.response?.data?.message || 'Failed to add money to goal', 'error');
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await goalService.delete(id);
      addToast('Goal Removed', 'Savings goal deleted.');
      await refreshData();
    } catch (error: any) {
      addToast('Error Deleting Goal', 'Failed to delete goal', 'error');
    }
  };

  // Recurring CRUD
  const addRecurring = async (data: Partial<RecurringTransaction>) => {
    try {
      await recurringService.create(data);
      addToast('Recurring Item Set', `Added recurring payment for ${data.name}.`);
      await refreshData();
    } catch (error: any) {
      addToast('Error Adding Item', error.response?.data?.message || 'Failed to add recurring item', 'error');
    }
  };

  const updateRecurring = async (id: string, data: Partial<RecurringTransaction>) => {
    try {
      await recurringService.update(id, data);
      addToast('Item Updated', 'Recurring payment modified.');
      await refreshData();
    } catch (error: any) {
      addToast('Error Updating Item', 'Failed to update recurring item', 'error');
    }
  };

  const deleteRecurring = async (id: string) => {
    try {
      await recurringService.delete(id);
      addToast('Item Removed', 'Recurring payment cancelled.');
      await refreshData();
    } catch (error: any) {
      addToast('Error Removing Item', 'Failed to delete recurring item', 'error');
    }
  };

  // Notifications
  const markNotificationRead = async (id: string) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      addToast('Notifications Cleared', 'All marked as read.');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FinancialContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        transactions,
        budgets,
        goals,
        recurring,
        notifications,
        summary,
        categories,
        monthlyTrends,
        insights,
        isLoading,
        refreshData,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        addGoal,
        updateGoal,
        addMoneyToGoal,
        deleteGoal,
        addRecurring,
        updateRecurring,
        deleteRecurring,
        markNotificationRead,
        markAllNotificationsRead,
        formatINR,
        isAddTransactionOpen,
        setIsAddTransactionOpen,
        isAddBudgetOpen,
        setIsAddBudgetOpen,
        isAddGoalOpen,
        setIsAddGoalOpen,
        isAddRecurringOpen,
        setIsAddRecurringOpen,
        editingTransaction,
        setEditingTransaction,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
