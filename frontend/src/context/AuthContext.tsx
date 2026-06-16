import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import type { Employee } from '../types/auth';

export interface AuthContextType {
  user: Employee | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, user: Employee) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const hasAccessToken = localStorage.getItem('accessToken');
      if (hasAccessToken) {
        try {
          const response = await api.get('/profile');
          setUser({
            name: response.data.name,
            userId: response.data.username,
            department: response.data.department,
          });
        } catch (err) {
          console.warn("Session expired or invalid:", err);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = (token: string, user: Employee) => {
    localStorage.setItem('accessToken', token);
    setUser(user);
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error("Failed backend logout", err);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  return (        // providing the authentication state and functions to the rest of the app through the AuthContext.Provider. The value prop of the provider is an object that contains the user, isAuthenticated, loading, login, and logout properties, which can be accessed by any component that consumes this context. The children prop allows us to wrap our application with this provider so that all components can access the authentication context.
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

