import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
  updateUser: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('fintrack_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('fintrack_token');
      if (storedToken) {
        try {
          const data = await authService.getMe();
          setUser(data.user);
          setToken(storedToken);
        } catch (err) {
          localStorage.removeItem('fintrack_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password: pass });
      localStorage.setItem('fintrack_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    try {
      const data = await authService.register({ fullName: name, email, password: pass });
      localStorage.setItem('fintrack_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async () => {
    await login('demo@fintrack.app', 'demouser123');
  };

  const logout = () => {
    localStorage.removeItem('fintrack_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        loginAsDemo,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
