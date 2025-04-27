import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'insurer' | 'policyholder';
  insurerName?: string;
  insuranceType?: 'personal' | 'corporate';
  idLastFour?: string;
  inviteCode?: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  verifyInviteCode: (code: string) => Promise<{ valid: boolean; insurerName?: string }>;
  registerUser: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users and invite codes for demo purposes
const MOCK_USERS = [
  { id: '1', email: 'insurer@detachd.com', password: 'insurer123', role: 'insurer', insurerName: 'Discovery Insure' },
  { id: '2', email: 'insurerdemo@detachd.com', password: 'insurer123', role: 'insurer', insurerName: 'Clientele Life' },
  { id: '3', email: 'demo@detachd.com', password: 'demo123', role: 'policyholder', insurerName: 'Discovery Insure', insuranceType: 'personal', idLastFour: '3087' },
];

const VALID_INVITE_CODES = {
  'DISC2025': 'Discovery Insure',
  'CLIENT2025': 'Clientele Life',
  'SANLAM2025': 'Sanlam',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('detachd_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const verifyInviteCode = async (code: string): Promise<{ valid: boolean; insurerName?: string }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const insurerName = VALID_INVITE_CODES[code as keyof typeof VALID_INVITE_CODES];
        resolve({
          valid: !!insurerName,
          insurerName,
        });
      }, 1000);
    });
  };

  const registerUser = async (userData: Partial<User>): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Math.random().toString(36).substring(2, 9),
          ...userData,
        };
        setCurrentUser(newUser as User);
        localStorage.setItem('detachd_user', JSON.stringify(newUser));
        resolve(true);
      }, 1000);
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );
        
        if (user) {
          const { password, ...userWithoutPassword } = user;
          setCurrentUser(userWithoutPassword);
          localStorage.setItem('detachd_user', JSON.stringify(userWithoutPassword));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('detachd_user');
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    verifyInviteCode,
    registerUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};