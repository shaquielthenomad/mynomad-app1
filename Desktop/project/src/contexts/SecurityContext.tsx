import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SecurityContextType {
  isAuthenticated: boolean;
  sessionTimeout: number;
  lastActivity: Date | null;
  resetSession: () => void;
  updateActivity: () => void;
  validateIP: (ip: string) => boolean;
  logAuditEvent: (event: AuditEvent) => void;
}

interface AuditEvent {
  userId: string;
  action: string;
  timestamp: Date;
  details: Record<string, unknown>;
  ip?: string;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEvent[]>([]);

  useEffect(() => {
    const checkSession = () => {
      if (lastActivity && Date.now() - lastActivity.getTime() > SESSION_TIMEOUT) {
        setIsAuthenticated(false);
        setLastActivity(null);
      }
    };

    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, [lastActivity]);

  const resetSession = () => {
    setIsAuthenticated(false);
    setLastActivity(null);
  };

  const updateActivity = () => {
    setLastActivity(new Date());
  };

  const validateIP = (ip: string): boolean => {
    // Implement IP validation logic here
    return true; // Simplified for demo
  };

  const logAuditEvent = (event: AuditEvent) => {
    const updatedLog = [...auditLog, event];
    setAuditLog(updatedLog);
    localStorage.setItem('detachd_audit_log', JSON.stringify(updatedLog));
  };

  const value = {
    isAuthenticated,
    sessionTimeout: SESSION_TIMEOUT,
    lastActivity,
    resetSession,
    updateActivity,
    validateIP,
    logAuditEvent,
  };

  return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>;
};

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};