import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Verification {
  id: string;
  userId: string;
  imageUrl: string;
  status: 'pending' | 'verified' | 'tampered';
  timestamp: Date;
  consent: boolean;
  reviewStatus: 'pending' | 'in_review' | 'reviewed';
  insurerNotes?: string;
  certificateUrl?: string;
}

interface VerificationContextType {
  currentVerification: Verification | null;
  verificationHistory: Verification[];
  uploadImage: (file: File, consent: boolean) => Promise<void>;
  processVerification: () => Promise<void>;
  resetVerification: () => void;
  updateVerificationStatus: (id: string, status: string, notes?: string) => Promise<void>;
  generateCertificate: (id: string) => Promise<string>;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentVerification, setCurrentVerification] = useState<Verification | null>(null);
  const [verificationHistory, setVerificationHistory] = useState<Verification[]>(() => {
    const savedHistory = localStorage.getItem('detachd_verifications');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const uploadImage = async (file: File, consent: boolean): Promise<void> => {
    const imageUrl = URL.createObjectURL(file);
    
    const newVerification: Verification = {
      id: Math.random().toString(36).substring(2, 9),
      userId: '1',
      imageUrl,
      status: 'pending',
      timestamp: new Date(),
      consent,
      reviewStatus: 'pending',
    };
    
    setCurrentVerification(newVerification);
  };

  const processVerification = async (): Promise<void> => {
    if (!currentVerification) return;

    return new Promise((resolve) => {
      setTimeout(() => {
        const result = Math.random() >= 0.5 ? 'verified' : 'tampered';
        
        const updatedVerification = {
          ...currentVerification,
          status: result as 'verified' | 'tampered',
          reviewStatus: 'in_review',
        };
        
        setCurrentVerification(updatedVerification);
        
        const updatedHistory = [updatedVerification, ...verificationHistory];
        setVerificationHistory(updatedHistory);
        localStorage.setItem('detachd_verifications', JSON.stringify(updatedHistory));
        
        resolve();
      }, 5000);
    });
  };

  const updateVerificationStatus = async (id: string, status: string, notes?: string): Promise<void> => {
    const updatedHistory = verificationHistory.map(v => {
      if (v.id === id) {
        return {
          ...v,
          reviewStatus: status,
          insurerNotes: notes,
        };
      }
      return v;
    });

    setVerificationHistory(updatedHistory);
    localStorage.setItem('detachd_verifications', JSON.stringify(updatedHistory));
  };

  const generateCertificate = async (id: string): Promise<string> => {
    // In a real app, this would generate a PDF certificate
    return `https://mynomad-app1.windsurf.build/certificates/${id}`;
  };

  const resetVerification = () => {
    setCurrentVerification(null);
  };

  const value = {
    currentVerification,
    verificationHistory,
    uploadImage,
    processVerification,
    resetVerification,
    updateVerificationStatus,
    generateCertificate,
  };

  return <VerificationContext.Provider value={value}>{children}</VerificationContext.Provider>;
};

export const useVerification = (): VerificationContextType => {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
};