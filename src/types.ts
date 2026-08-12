export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Food'
  | 'Shopping'
  | 'Transportation'
  | 'Bills'
  | 'Entertainment'
  | 'Healthcare'
  | 'Education'
  | 'Other';

export type IncomeCategory =
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Gift'
  | 'Other';

export type TransactionCategory = ExpenseCategory | IncomeCategory;

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: TransactionCategory;
  date: string; // ISO string YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  status: 'completed' | 'pending';
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: ExpenseCategory;
  limitAmount: number;
  spentAmount: number;
  month: string; // YYYY-MM
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentSaved: number;
  targetDate: string; // YYYY-MM-DD
  category: string;
  createdAt: string;
}

export type RecurringFrequency = 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';

export interface RecurringTransaction {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  frequency: RecurringFrequency;
  nextPaymentDate: string; // YYYY-MM-DD
  note?: string;
  autoDeduct?: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'budget' | 'recurring' | 'goal' | 'system' | 'large_expense';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  currency: string; // default 'INR' (₹)
  dateFormat: string;
  defaultCategory: ExpenseCategory;
  budgetAlerts: boolean;
  recurringAlerts: boolean;
  goalAlerts: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface FinancialSummary {
  totalBalance: number;
  balanceChangePct: number;
  totalIncome: number;
  incomeChangePct: number;
  totalExpenses: number;
  expensesChangePct: number;
  totalSavings: number;
  savingsRatePct: number;
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface FinancialInsight {
  id: string;
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  stat?: string;
}
