import React, { createContext, useState } from 'react';
import type { Employee } from '../types/auth';

export interface AuthContextType {
  user: Employee | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: Employee) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<Employee | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser && savedUser !== 'undefined') {
        return JSON.parse(savedUser);
      }
      return null;
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });

  const login = (newToken: string, employeeData: Employee) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(employeeData));
    setToken(newToken);
    setUser(employeeData);
  };

  // Stateless client-side logout: wipe token and state instantly without session management overhead 
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children} 
    </AuthContext.Provider>
  );
};
