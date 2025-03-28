import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Employee } from '../data/employees';

interface AuthContextType {
  employee: Employee | null;
  login: (emp: Employee) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null);

  const login = (emp: Employee) => {
    setEmployee(emp);
  };

  const logout = () => {
    setEmployee(null);
  };

  return (
    <AuthContext.Provider value={{ employee, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}